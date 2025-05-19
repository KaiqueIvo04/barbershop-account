import { inject, injectable } from 'inversify'
import { IAuthRepository } from '../../application/port/auth.repository.interface'
import { Identifier } from '../../di/identifiers'
import { User } from '../../application/domain/model/user'
import { UserEntity } from '../../infrastructure/entity/user.entity'
import jwt from 'jsonwebtoken'
import { RepositoryException } from '../../application/domain/exception/repository.exception'
import { Strings } from '../../utils/strings'
import { AuthenticationException } from '../../application/domain/exception/authentication.exception'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { readFileSync } from 'fs'
import { ILogger } from '../../utils/custom.logger'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { Credentials } from '../../application/domain/model/credentials'
import { UsersScopes } from '../../application/domain/utils/user.scopes'
import { Default } from '../../utils/default'
/**
 * Implementation of the auth repository.
 *
 * @implements {IAuthRepository}
 */
@injectable()
export class AuthRepository implements IAuthRepository {
    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _userModel: any,
        @inject(Identifier.USER_ENTITY_MAPPER) readonly _userMapper: IEntityMapper<User, UserEntity>,
        @inject(Identifier.USER_REPOSITORY) readonly _userRepo: IUserRepository,
        @inject(Identifier.LOGGER) _logger: ILogger
    ) {
    }

    public authenticate(credentials: Credentials): Promise<object> {
        const identifier = credentials.email?.toLowerCase()

        return new Promise<object>((resolve, reject) => {
            this._userModel.findOne({ email: identifier, active: true })
                .collation({ locale: 'en', strength: 2 })
                .then(async (user: UserEntity) => {
                    /* Validate password and generate access token*/
                    if (!user || !user.password ||
                        !this._userRepo.comparePasswords(credentials.password!, user.password)) {
                        return reject(new AuthenticationException(
                            'Authentication failed due to invalid authentication credentials.'))
                    }
                    return resolve({ access_token: await this.generateAccessToken(this._userMapper.transform(user)) })
                })
                .catch(() => reject(new RepositoryException(Strings.ERROR_MESSAGE.UNEXPECTED)))
        })
    }

    /**
     * Searches for a user by email and updates it with a token that has priority to reset their password.
     *
     * @param email
     * @return {Promise<User | undefined>}
     * @throws {ValidationException | RepositoryException}
     */
    // public async forgotPassword(email: string): Promise<User | undefined> {
    //     try {
    //         const user: User | undefined =
    //             await this._userRepo.findOne(new Query().fromJSON({ filters: { email, active: true } }))
    //         if (!user) return Promise.resolve(undefined)

    //         const token: string = await this.generateAccessToken(user, true)
    //         if (!token) return Promise.resolve(undefined!)

    //         const result: UserEntity =
    //             await this._userModel.findOneAndUpdate(
    //                 { _id: user.id },
    //                 { password_reset_token: token },
    //                 { new: true }
    //             )
    //         return Promise.resolve(this._userMapper.transform(result))
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }
    // }

    public validateToken(token: string): Promise<boolean> {
        try {
            const public_key = readFileSync(`${process.env.JWT_PUBLIC_KEY_PATH}`, 'utf-8')
            const result = jwt.verify(token, public_key, { algorithms: ['RS256'] })
            return Promise.resolve(!!result)
        } catch (err) {
            return Promise.reject(new AuthenticationException(Strings.ERROR_MESSAGE.INVALID_PASSWORD_RESET_TOKEN,
                Strings.ERROR_MESSAGE.INVALID_PASSWORD_RESET_TOKEN_DESC))
        }
    }

    // public getTokenPayload(token: string): Promise<any> {
    //     try {
    //         return Promise.resolve(jwt.decode(token))
    //     } catch (err) {
    //         return Promise.reject(new AuthenticationException('Could not complete change password request. ' +
    //             'Please try again later.'))
    //     }
    // }

    public async generateAccessToken(user: User, resetToken?: boolean): Promise<string> {
        try {
            const private_key = readFileSync(`${process.env.JWT_PRIVATE_KEY_PATH}`, 'utf-8')

            const payload: object = {
                sub: user.id,
                sub_type: user.type,
                iss: process.env.ISSUER || Default.ISSUER,
                iat: Math.floor(Date.now() / 1000),
                scope: UsersScopes.getUserScopes(user.type!).join(' ')
            }

            return Promise.resolve(jwt.sign(payload, private_key, { expiresIn: '8h', algorithm: 'RS256' }))
        } catch (err) {
            return Promise.reject(
                new AuthenticationException('Authentication failed due to failure at generate the access token.'))
        }
    }
}
