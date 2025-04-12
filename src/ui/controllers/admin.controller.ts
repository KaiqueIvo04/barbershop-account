import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IAdminService } from 'application/port/admin.service.interface'
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { Admin } from 'application/domain/model/admin'
import { ILogger } from 'utils/custom.logger'
import { IQuery } from 'application/port/query.interface'
import { UserType } from 'application/domain/utils/user.types'

@controller('/v1/admins')
export class AdminController {

    // private static handlerError(res: Response, err: any) {
    //     const handlerError = ApiExceptionManager.build(err)
    //     return res.status(handlerError.code)
    //         .send(handlerError.toJSON())
    // }

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

    // @httpGet('/find/:directory_id')
    // public async getByDirectory(@request() req: Request, @response() res: Response): Promise<Response> {
    //     try {
    //         const { directory_id } = req.params
    //         const file = await this._service.findByDirectory(directory_id)
    //         return res.status(HttpStatus.OK).send(file)
    //     } catch (err) {
    //         return FileController.handlerError(res, err)
    //     }
    // }

    private toJSONView(admin: Admin | Array<Admin> | undefined): object {
        if (admin instanceof Array) return admin.map(item => item.toJSON())
        return admin?.toJSON()
    }
}
