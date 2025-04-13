import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Identifier } from 'di/identifiers'
import { Query } from './query/query'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { IUserRepository } from 'application/port/user.repository.interface'
import { Client } from 'application/domain/model/client'
import { ClientEntity } from 'infrastructure/entity/client.entity'
import { IClientRepository } from 'application/port/client.repository.interface'
import { UserType } from 'application/domain/utils/user.types'

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

    public async checkExists(client: Client): Promise<boolean> {
        const query: Query = new Query().fromJSON({ filters: { _id: { $ne: client.id } } })
        // const check_cpf = (process.env.CHECK_CPF === 'true') ? true : Default.CHECK_CPF

        if (client.email) {
            const user_email = client.email.toLowerCase()
            query.addFilter({ email: user_email })
        } else if (client.email) {
            const user_email = client.email.toLowerCase()
            query.addFilter({ email: user_email })
        }

        // if (client.cnpj && client.email) {
        //     const user_email = client.email.toLowerCase()
        //     query.addFilter({ $or: [{ cpf: client.cnpj }, { email: user_email }] })
        // } else if (client.cnpj) {
        //     query.addFilter({ cnpj: client.cnpj })
        // } else if (client.email) {
        //     const user_email = client.email.toLowerCase()
        //     query.addFilter({ email: user_email })
        // }

        // if (check_cpf && client.cpf) {
        //     const result = await this._userRepo.checkCpf(client.cpf)
        //     if (!result) Promise.reject(result)
        // }

        return new Promise<boolean>((resolve, reject) => {
            super.find(query)
                .then((result: Array<Client> | undefined) => {
                    if (!result?.length) resolve(!result)
                    if (result && result.length > 0) resolve(!!result)
                    else if (result && result[0].email === client.email) resolve(!!result)
                    resolve(!result)
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    public update(item: Client): Promise<Client | undefined> {
        const itemUp: any = this.mapper.transform(item)
        let set: any = { $set: itemUp }

        if (itemUp.cpf) {
            set = {
                $set: { ...itemUp, __enc_cpf: false },
                $unset: { cnpj: '' }
            }
        }

        if (itemUp.cnpj) {
            set = {
                $set: { ...itemUp, __enc_cnpj: false },
                $unset: { cpf: '' }
            }
        }

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
