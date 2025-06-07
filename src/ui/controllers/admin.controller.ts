import { inject } from 'inversify'
import { controller, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { Identifier } from '../../di/identifiers'
import { IAdminService } from '../../application/port/admin.service.interface'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { Admin } from '../../application/domain/model/admin'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { UserType } from '../../application/domain/utils/user.types'
import { NotFoundException } from '../../application/domain/exception/not.found.exception'
import { Strings } from '../../utils/strings'

@controller('/v1/admins')
export class AdminController {
    constructor(
        @inject(Identifier.ADMIN_SERVICE) private readonly _adminService: IAdminService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpPost('/')
    public async saveAdmin(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const newAdmin: Admin = new Admin().fromJSON(req.body)
            newAdmin.id = undefined
            const result: Admin | undefined = await this._adminService.add(newAdmin)

            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))

        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/')
    public async getAllAdmins(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ type: UserType.ADMIN })
            const result: Array<Admin> = await this._adminService.getAll(query)

            const count: number = await this._adminService.count(query)
            res.setHeader('X-Total-Count', count)

            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/:admin_id')
    public async getAdminById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ _id: req.params.admin_id, type: UserType.ADMIN })

            const result: Admin | undefined = await this._adminService.getById(req.params.admin_id, query)

            if (!result) throw new NotFoundException(Strings.ADMIN.NOT_FOUND, Strings.ADMIN.NOT_FOUND_DESCRIPTION)

            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpPatch('/:admin_id')
    public async updateAdminById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const updateAdmin: Admin = new Admin().fromJSON(req.body)
            updateAdmin.id = req.params.admin_id

            const result: Admin | undefined = await this._adminService.update(updateAdmin)

            if (!result) throw new NotFoundException(Strings.ADMIN.NOT_FOUND, Strings.ADMIN.NOT_FOUND_DESCRIPTION)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    private toJSONView(admin: Admin | Array<Admin> | undefined): object {
        if (admin instanceof Array) return admin.map(item => item.toJSON())
        return admin?.toJSON()
    }
}
