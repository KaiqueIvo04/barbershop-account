import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { Client } from '../../application/domain/model/client'
import { ClientEntity } from '../../infrastructure/entity/client.entity'
import { IClientRepository } from '../../application/port/client.repository.interface'
import { UserType } from '../../application/domain/utils/user.types'

/**
 * Implementation of the Client repository.
 *
 * @implements {IClientRepository}
 */
@injectable()
export class ClientRepository extends BaseRepository<Client, ClientEntity> implements IClientRepository {
    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _clientModel: any,
        @inject(Identifier.CLIENT_ENTITY_MAPPER) readonly _clientMapper: IEntityMapper<Client, ClientEntity>,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepo: IUserRepository,
        @inject(Identifier.LOGGER) readonly _logger: any
    ) {
        super(_clientModel, _clientMapper, _logger)
    }

    public async create(item: Client): Promise<Client | undefined> {
        if (item.password) item.password = this._userRepo.encryptPassword(item.password)
        return super.create(item)
    }

    public update(item: Client): Promise<Client | undefined> {
        const itemUp: any = this.mapper.transform(item)

        const set: any = { $set: itemUp }

        // if (itemUp.cpf) set = { $set: { ...itemUp, __enc_cpf: false } }
        return new Promise<Client | undefined>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: itemUp.id, type: UserType.CLIENT }, set, { new: true })
                .exec()
                .then((result: ClientEntity) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }
}
