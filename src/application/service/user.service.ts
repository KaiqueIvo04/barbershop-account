import { IUserService } from '../port/user.service.interface'
import { User } from '../domain/model/user'
import { IQuery } from '../port/query.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IUserRepository } from '../port/user.repository.interface'
import { IIntegrationEventRepository } from 'application/port/integration.event.repository.interface'
import { ConflictException } from '../domain/exception/conflict.exception'
import { Strings } from '../../utils/strings'
import { Query } from '../../infrastructure/repository/query/query'

@injectable()
export class UserService implements IUserService {

    constructor(
        @inject(Identifier.User_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY)
        private readonly _integrationEventRepository: IIntegrationEventRepository,
    ) {
    }

    public async add(item: User): Promise<User | undefined> {
        try {
            const exist = await this._repository.checkExists(item)
            if (exist) throw new ConflictException(Strings.ERROR_MESSAGE.FILE_ALREADY_EXISTS)

            const isRoot = await this._repository.find(new Query().fromJSON({
                type: TypeDrive.ROOT
            }))

            if (isRoot.length > 1) {
                throw new ConflictException(Strings.ERROR_MESSAGE.ROOT_ALREADY_EXISTS)
            }

            const result = await this._repository.create(item)

            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public count(query: IQuery): Promise<number> {
        return this._repository.count(query)
    }

    public async createFolder(name: string, User_id: string): Promise<User | undefined> {
        try {
            const query = new Query()
            query.addFilter({
                _name: name
            })
            const exist = await this._repository.findOne(query)
            if (exist) throw new ConflictException(Strings.ERROR_MESSAGE.FILE_ALREADY_EXISTS_NAME)

            const result = await this._repository.create(new User().fromJSON({
                name,
                type: TypeDrive.User,
                User: User_id
            }))

            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<User>> {
        const result = await this._repository.find(query)
        const Users: Array<User> = []
        for (const User of result) {
            const files: Array<File> = []
            const file: Array<any> = await this._fRepository.findByUser(User.id as string)
            for (const fl of file) {
                const fil = new File().fromJSON({
                    file_id: fl._id,
                    file_name: fl.filename
                })
                files.push(fil)
            }
            const direct = new User().fromJSON({
                ...User.toJSON(),
            })
            direct.files = files
            Users.push(direct)
        }
        return Users
    }

    public async getById(id: string, query: IQuery): Promise<User | undefined> {
        query.addFilter({ _id: id })
        const result = await this._repository.findOne(query)
        const User = new User().fromJSON({
            ...result?.toJSON()
        })
        const files: Array<File> = []
        const file: Array<any> = await this._fRepository.findByUser(result?.id as string)
        for (const fl of file) {
            const fil = new File().fromJSON({
                file_id: fl._id,
                file_name: fl.filename
            })
            files.push(fil)
        }
        User.files = files
        return User
    }

    public remove(id: string): Promise<boolean> {
        try {
            this._fRepository.downloadFile(id)
            this._repository.delete(id)

            return Promise.resolve(true)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public update(item: User): Promise<User | undefined> {
        return this._repository.update(item)
    }

    public async updateFolder(item: User): Promise<User | undefined> {
        try {
            if (item.type !== TypeDrive.User) throw new ConflictException(Strings.ERROR_MESSAGE.CANNOT_CHANGE_THE_TYPE)

            const result = await this._repository.update(item)

            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async uploadFiles(files: SendFile): Promise<User | undefined> {
        try {
            if (!files.files?.length) {
                throw new Error(Strings.ERROR_MESSAGE.FILE_NOT_PROVIDE)
            }

            const User = await this._repository.findOne(new Query().fromJSON({
                _id: files.User_id
            }))

            User?.files?.push(...files.files)

            if (User instanceof User) {
                const result = await this._repository.update(User)
                return Promise.resolve(result)
            }
        } catch (err) {
            return Promise.reject(err)
        }
    }

}
