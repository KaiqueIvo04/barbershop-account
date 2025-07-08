import { inject } from 'inversify'
import { controller, httpGet, httpPatch, httpPost, httpDelete, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { Client } from '../../application/domain/model/client'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { UserType } from '../../application/domain/utils/user.types'
import { NotFoundException } from '../../application/domain/exception/not.found.exception'
import { Strings } from '../../utils/strings'
import { IClientService } from '../../application/port/client.service.interface'

@controller('/v1/clients')
export class ClientController {
    constructor(
        @inject(Identifier.CLIENT_SERVICE) private readonly _clientService: IClientService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpPost('/')
    public async saveClient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const newClient: Client = new Client().fromJSON(req.body)
            newClient.id = undefined
            const result: Client | undefined = await this._clientService.add(newClient)

            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))

        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/')
    public async getAllClients(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ type: UserType.CLIENT })
            const result: Array<Client> = await this._clientService.getAll(query)

            const count: number = await this._clientService.count(query)
            res.setHeader('X-Total-Count', count)

            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/:client_id')
    public async getClientById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ _id: req.params.client_id, type: UserType.CLIENT})

            const result: Client | undefined = await this._clientService.getById(req.params.client_id, query)

            if (!result) throw new NotFoundException(Strings.CLIENT.NOT_FOUND, Strings.CLIENT.NOT_FOUND_DESCRIPTION)

            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpPatch('/:client_id')
    public async updateClientById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const updateClient: Client = new Client().fromJSON(req.body)
            updateClient.id = req.params.client_id

            const result: Client | undefined = await this._clientService.update(updateClient)

            if (!result) throw new NotFoundException(Strings.CLIENT.NOT_FOUND, Strings.CLIENT.NOT_FOUND_DESCRIPTION)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }


    @httpDelete('/:client_id')
    public async deleteEmpoyeeById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._clientService.remove(req.params.client_id)

            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    private toJSONView(client: Client | Array<Client> | undefined): object {
        if (client instanceof Array) return client.map(item => item.toJSON())
        return client?.toJSON()
    }
}
