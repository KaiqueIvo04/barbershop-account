import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpGet, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { IUserService } from '../../application/port/user.service.interface'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ILogger } from '../../utils/custom.logger'
import { User } from '../../application/domain/model/user'
import { IQuery } from '../../application/port/query.interface'
import { Query } from '../../infrastructure/repository/query/query'

@controller('/v1/users')
export class UsersController {
    constructor(
        @inject(Identifier.USER_SERVICE) private readonly _userService: IUserService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpGet('/')
    public async getAllUsers(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)

            const result: Array<User> = await this._userService.getAll(query)

            const count: number = await this._userService.count(query)
            res.setHeader('X-Total-Count', count)

            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code).send(handleError.toJSON())
        }
    }

    private toJSONView(user: User | Array<User> | undefined): object {
        if (user instanceof Array) return user.map(item => item.toJSON())
        return user?.toJSON()
    }
}
