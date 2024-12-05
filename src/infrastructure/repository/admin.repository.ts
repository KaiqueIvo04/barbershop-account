import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Identifier } from 'di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { IUserRepository } from 'application/port/user.repository.interface'
import { Admin } from 'application/domain/model/admin'
import { AdminEntity } from 'infrastructure/database/entity/admin.entity'
import { IAdminRepository } from 'application/port/admin.repository.interface'
import { UserType } from 'application/domain/utils/user.types'

/**
 * Implementation of the Admin repository.
 *
 * @implements {IAdminRepository}
 */
@injectable()
export class AdminRepository extends BaseRepository<Admin, AdminEntity> implements IAdminRepository {
    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _adminModel: any,
        @inject(Identifier.ADMIN_ENTITY_MAPPER) readonly _adminMapper: IEntityMapper<Admin, AdminEntity>,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepo: IUserRepository,
        @inject(Identifier.LOGGER) readonly _logger: any
    ) {
        super(_adminModel, _adminMapper, _logger)
    }

    public async create(item: Admin): Promise<Admin | undefined> {
        if (item.password) item.password = this._userRepo.encryptPassword(item.password)
        return super.create(item)
    }

    public update(item: Admin): Promise<Admin | undefined> {
        const itemUp: any = this.mapper.transform(item)

        let set: any = { $set: itemUp }

        if (itemUp.cpf) set = { $set: { ...itemUp, __enc_cpf: false } }
        return new Promise<Admin | undefined>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: itemUp.id, type: UserType.ADMIN }, set, { new: true })
                .exec()
                .then((result: AdminEntity) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }
}
