import { inject } from "inversify";
import { controller, httpPost, request, response } from "inversify-express-utils";
import { Request, Response } from "express";
import HttpStatus from "http-status-codes";
import { Credentials } from "../../application/domain/model/credentials";
import { Identifier } from "../../di/identifiers";
import { ApiException } from "../../ui/exception/api.exception";
import { ApiExceptionManager } from "../../ui/exception/api.exception.manager";
import { IAuthService } from "../../application/port/auth.service.interface";

@controller("/v1/auth")
export class AuthController {
    constructor(
        @inject(Identifier.AUTH_SERVICE) private readonly _authService: IAuthService
    ){}

    @httpPost('/')
    public async auth(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const credentials: Credentials = new Credentials().fromJSON(req.body)
            const result: object = await this._authService.authenticate(credentials)
            if (result) return res.status(HttpStatus.OK).send(result)
            return res.status(HttpStatus.UNAUTHORIZED)
                .send(new ApiException(HttpStatus.UNAUTHORIZED, 'Invalid email or password!').toJSON())
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }
}