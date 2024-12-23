import { IUserService } from '../port/user.service.interface'
import { User } from '../domain/model/user'
// import { Email } from 'application/domain/model/email'
import { IQuery } from '../port/query.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IUserRepository } from '../port/user.repository.interface'
// import { IIntegrationEventRepository } from 'application/port/integration.event.repository.interface'
import { ObjectIdValidator } from 'application/domain/validator/object.id.validator'
// import { UserParamsValidator } from 'application/domain/validator/user.params.validator'
// import { UpdateUserActiveValidator } from 'application/domain/validator/update.user.active.validator'
// import { NotFoundException } from 'application/domain/exception/not.found.exception'
import { Strings } from '../../utils/strings'

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        // @inject(Identifier.INTEGRATION_EVENT_REPOSITORY) private readonly
        // _integrationEventRepository: IIntegrationEventRepository,
    ) {
    }

    public add(item: User): Promise<User> {
        throw new Error('Unsupported feature!')
    }

    public getAll(query: IQuery): Promise<Array<User>> {
        return this._userRepository.find(query)
    }

    public getById(id: string, query: IQuery): Promise<User | undefined> {
        try {
            ObjectIdValidator.validate(id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)

            return this._userRepository.findOne(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public update(item: User): Promise<User> {
        throw new Error('Unsupported feature!')
    }

    public count(query: IQuery): Promise<number> {
        return this._userRepository.count(query)
    }

    // public async updateActive(id: string, active: boolean): Promise<User | undefined> {
    //     try {
    //         ObjectIdValidator.validate(id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)

    //         const user: User | undefined = await this._userRepository.findById(id)

    //         if (!user) return Promise.reject(new NotFoundException(Strings.USER.NOT_FOUND, Strings.USER.NOT_FOUND_DESCRIPTION))

    //         UpdateUserActiveValidator.validate(user, active)

    //         const result: User | undefined = await this._userRepository.updateActive(id, active)

    //         // If User has been deactivated, publish a UserDeactivateEvent on the message bus.
    //         if (result && !active && user.active) {
    //             await this._integrationEventRepository.publishEvent(new UserDeactivateEvent(new Date()))
    //         }

    //         return Promise.resolve(result)
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }

    // public async resetPassword(id: string, password: string): Promise<User | undefined> {
    //     try {
    //         // 1. Validate user ID
    //         ObjectIdValidator.validate(id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)

    //         // 2. Find user by id
    //         const userResult = await this._userRepository.findById(id)

    //         // 3. Validate password
    //         UserParamsValidator.validatePassword(password, 'password')

    //         // 4. Update user password
    //         const result: User | undefined = await this._userRepository.resetUserPassword(id, password)
    //         if (result && userResult) {
    //             const mail: Email = new Email().fromJSON({
    //                 to: {
    //                     name: userResult.name,
    //                     email: userResult.email
    //                 },
    //             })

    //             this._integrationEventRepository.publishEvent(new EmailUpdatePasswordEvent(new Date(), mail))

    //         }

    //         return Promise.resolve(result)
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }
    // }

    // public async updateActive(id: string, active: boolean): Promise<User | undefined> {
    //     try {
    //         ObjectIdValidator.validate(id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)

    //         const user: User | undefined = await this._userRepository.findById(id)

    //         if (!user) return Promise.reject(new NotFoundException(Strings.USER.NOT_FOUND, Strings.USER.NOT_FOUND_DESCRIPTION))

    //         UpdateUserActiveValidator.validate(user, active)

    //         const result: User | undefined = await this._userRepository.updateActive(id, active)

    //         // If User has been deactivated, publish a UserDeactivateEvent on the message bus.
    //         if (result && !active && user.active) {
    //             await this._integrationEventRepository.publishEvent(new UserDeactivateEvent(new Date()))
    //         }

    //         return Promise.resolve(result)
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }
    // }

    public async remove(id: string): Promise<boolean> {
        throw new Error('Unsupported feature!')
    }

}
