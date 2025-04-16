import { inject, injectable } from 'inversify'
import { IClientService } from '../../application/port/client.service.interface'
import { Identifier } from '../../di/identifiers'
import { IClientRepository } from '../../application/port/client.repository.interface'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { Client } from '../../application/domain/model/client'
import { UserType } from '../../application/domain/utils/user.types'
import { CreateClientValidator } from '../../application/domain/validator/create.client.validator'
import { ConflictException } from '../../application/domain/exception/conflict.exception'
import { Strings } from '../../utils/strings'
import { IQuery } from '../../application/port/query.interface'
import { ObjectIdValidator } from '../../application/domain/validator/object.id.validator'
import { UpdateClientValidator } from '../../application/domain/validator/update.client.validator'

@injectable()
export class ClientService implements IClientService {
    constructor(
        @inject(Identifier.CLIENT_REPOSITORY) private readonly _clientRepository: IClientRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository
    ) {
    }

    public async add(client: Client): Promise<Client | undefined> {
        try {
            // 1. Check client fields
            CreateClientValidator.validate(client)

            // 2. Check if client already exists
            const clientExists: boolean = await this._userRepository.checkExists(client)
            if (clientExists) throw new ConflictException(Strings.USER.ALREADY_REGISTERED)

            // if OK Create client
            return this._clientRepository.create(client)
        } catch (err) {
            Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<Client>> {
        return this._clientRepository.find(query)
    }

    public async getById(id: string, query: IQuery): Promise<Client | undefined> {
        try {
            ObjectIdValidator.validate(id, Strings.CLIENT.PARAM_ID_NOT_VALID_FORMAT)

            return this._clientRepository.findOne(query)
        } catch (err) {
            Promise.reject(err)
        }
    }

    public async update(client: Client): Promise<Client | undefined> {
        try {
            // 1. Validate id parameter
            if (client.id)
                ObjectIdValidator.validate(client.id, Strings.CLIENT.PARAM_ID_NOT_VALID_FORMAT)

            // 2. Check if user is registered
            const result = await this._userRepository.findByIdAndType(client.id!, UserType.CLIENT)
            if (!result) return Promise.resolve(undefined)

            UpdateClientValidator.validate(client)

            // 4. Check conficts
            if (client.email) {
                const adminExists: boolean = await this._userRepository.checkExists(client)
                if (adminExists) throw new ConflictException(Strings.USER.ALREADY_REGISTERED)
            }

            // 5. Update user
            return this._clientRepository.update(client)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<boolean> {
        throw new Error('Unsupported feature!')
    }

    public count(query: IQuery): Promise<number> {
        return this._clientRepository.count(query)
    }
}
