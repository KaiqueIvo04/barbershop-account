import { inject, injectable } from 'inversify'
import { IAdminService } from 'application/port/admin.service.interface'
import { Identifier } from '../../di/identifiers'
import { IAdminRepository } from 'application/port/admin.repository.interface'
import { IUserRepository } from 'application/port/user.repository.interface'
import { IQuery } from '../port/query.interface'
import { UserType } from 'application/domain/utils/user.types'
import { CreateAdminValidator } from 'application/domain/validator/create.admin.validator'
import { ConflictException } from 'application/domain/exception/conflict.exception'
import { Admin } from 'application/domain/model/admin'
import { Strings } from 'utils/strings'
import { ObjectIdValidator } from 'application/domain/validator/object.id.validator'
import { UpdateAdminValidator } from 'application/domain/validator/update.admin.validator'

@injectable()
export class AdminService implements IAdminService {

    constructor(
        @inject(Identifier.ADMIN_REPOSITORY) private readonly _adminRepository: IAdminRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepo: IUserRepository,
    ) {
    }

    public async add(admin: Admin): Promise<Admin | undefined> {
        try {
            CreateAdminValidator.validate(admin)
            // const passwordWithoutCrypt: string = admin.password!

            const adminExists = await this._userRepo.checkExists(admin)
            if (adminExists) throw new ConflictException(Strings.USER.ALREADY_REGISTERED)

            const result: Admin | undefined = await this._adminRepository.create(admin)
            // if (result) {
            //     const mail: Email = new Email().fromJSON({
            //         to: {
            //             name: admin.name,
            //             email: admin.email
            //         },
            //         action_url: process.env.DASHBOARD_HOST || Default.DASHBOARD_HOST,
            //         password: passwordWithoutCrypt
            //     })
            //     this._integrationEventRepo.publishEvent(new EmailWelcomeEvent(new Date(), mail))
            // }

            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<Admin>> {
        return this._adminRepository.find(query)
    }


    public async getById(id: string, query: IQuery): Promise<Admin | undefined> {
        try {
            ObjectIdValidator.validate(id, Strings.ADMIN.PARAM_ID_NOT_VALID_FORMAT)

            return this._adminRepository.findOne(query)
        } catch (error) {
            Promise.reject(error)
        }
    }

    public async update(admin: Admin): Promise<Admin | undefined> {
        try {
            // 1. Validate id parameter
            if (admin.id)
                ObjectIdValidator.validate(admin.id, Strings.ADMIN.PARAM_ID_NOT_VALID_FORMAT)

            // 2. Check if user is registered
            const result = await this._userRepo.findByIdAndType(admin.id!, UserType.ADMIN)
            if (!result) return Promise.resolve(undefined)

            UpdateAdminValidator.validate(admin)

            // 4. Check conficts
            if (admin.email) {
                const adminExists: boolean = await this._userRepo.checkExists(admin)
                if (adminExists) throw new ConflictException(Strings.USER.ALREADY_REGISTERED)
            }

            // 5. Update user
            return this._adminRepository.update(admin)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<boolean> {
        throw new Error('Unsupported feature!')
    }

    public count(query: IQuery): Promise<number> {
        return this._adminRepository.count(query)
    }
}
