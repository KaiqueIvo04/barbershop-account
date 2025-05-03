import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IAuthService } from '../port/auth.service.interface'
import { IAuthRepository } from '../port/auth.repository.interface'
import { CredentialsValidator } from '../domain/validator/credentials.validator'
import { IUserRepository } from '../port/user.repository.interface'
// import { IIntegrationEventRepository } from '../port/integration.event.repository.interface'
// import { User } from '../domain/model/user'
// import { Email } from '../domain/model/email'
// import { EmailResetPasswordEvent } from '../integration_event/event/email.reset.password.event'
// import { Default } from '../../utils/default'
// import { ResetPasswordValidator } from '../domain/validator/reset.password.validator'
// import { EmailUpdatePasswordEvent } from '../integration_event/event/email.update.password.event'
import { Credentials } from '../domain/model/credentials'
// import { EmailValidator } from '../domain/validator/email.validator'
// import { ChangePasswordValidator } from '../domain/validator/change.password.validator'

/**
 * Implementation of the auth Service.
 *
 * @implements {IAuthService}
 */
@injectable()
export class AuthService implements IAuthService {

    constructor(
        @inject(Identifier.AUTH_REPOSITORY) private readonly _authRepository: IAuthRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        // @inject(Identifier.INTEGRATION_EVENT_REPOSITORY) private readonly _integrationEventRepo: IIntegrationEventRepository
    ) {
    }

    public async authenticate(credentials: Credentials): Promise<object> {
        try {
            CredentialsValidator.validate(credentials)

            const result: object = await this._authRepository.authenticate(credentials)

            if (result) await this._userRepository.updateLastLogin(credentials.email!!)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     * Searches for a user by email and updates it with a token that has priority to reset their password.
     *
     * @param email
     * @return {Promise<object>} Feedback message about the forgot password flow.
     * @throws {ValidationException | RepositoryException}
     */
    // public async forgotPassword(email: string): Promise<object> {
    //     try {
    //         EmailValidator.validate(email)
    //         const result: User | undefined = await this._authRepository.forgotPassword(email)
    //         if (result) await this._publishEmailResetPasswordEvent(result)
    //         return Promise.resolve({
    //             message: `If a matching account is found, an email has been sent
    //                       to ${email} to allow you to reset your password.`
    //         })
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }
    // }

    /**
     * Change's the user's password.
     * There are two scenarios available:
     *
     * SCENARIO 01 - User remembers his current password.
     *
     * The operation is accessed through a normal access token.
     * And the following parameters are used: email, old_password and new_password.
     *
     * SCENARIO 02 - User does not remember his current password.
     *
     * The operation is accessed through a access token with priority to reset the password,
     * a token obtained through the forgotPassword method.
     * And only the following parameters are used: email and new_password.
     *
     * @param email
     * @param oldPassword
     * @param newPassword
     * @param token
     * @return {Promise<boolean>} True if the password has been updated and false otherwise.
     * @throws {ValidationException | RepositoryException}
     */
    // public async changePassword(userEmail: string, oldPassword: string, newPassword: string, token: string): Promise<boolean> {
    //     try {
    //         const isValid: boolean = await this._authRepository.validateToken(token)
    //         if (!isValid) return Promise.resolve(false)
    //         const payload = await this._authRepository.getTokenPayload(token)

    //         // SCENARIO 01 - User remembers his current password.
    //         if (!(payload.sub_type === 'resetpasswd')) {
    //             ChangePasswordValidator.validate(userEmail, oldPassword, newPassword)
    //             const resultChange = await this._userRepository.changePassword(userEmail, oldPassword, newPassword)
    //             if (resultChange) {
    //                 await this._publishEmailUpdatePasswordEvent(resultChange)
    //             }
    //             return Promise.resolve(!!resultChange)
    //         }
    //         // SCENARIO 02 - User does not remember his current password.
    //         ResetPasswordValidator.validate(userEmail, newPassword)
    //         const resultReset = await this._userRepository.resetPassword(
    //              payload.iss.split('_')[0], userEmail, newPassword, token
    //         )
    //         if (resultReset) {
    //             await this._publishEmailUpdatePasswordEvent(resultReset)
    //         }
    //         return Promise.resolve(!!resultReset)
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }
    // }

    // private async _publishEmailResetPasswordEvent(user: User): Promise<void> {
    //     try {
    //         const host: string = process.env.DASHBOARD_HOST || Default.DASHBOARD_HOST
    //         const mail: Email = new Email().fromJSON({
    //             to: {
    //                 name: user.name,
    //                 email: user.email
    //             },
    //             action_url: `${host}/password-reset?token=${user.password_reset_token}`,
    //         })
    //         await this._integrationEventRepo.publishEvent(new EmailResetPasswordEvent(new Date(), mail))
    //         return Promise.resolve()
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }
    // }

    // private async _publishEmailUpdatePasswordEvent(user: User): Promise<void> {
    //     try {
    //         const mail: Email = new Email().fromJSON({
    //             to: {
    //                 name: user.name,
    //                 email: user.email
    //             }
    //         })
    //         await this._integrationEventRepo.publishEvent(new EmailUpdatePasswordEvent(new Date(), mail))
    //         return Promise.resolve()
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }
    // }
}
