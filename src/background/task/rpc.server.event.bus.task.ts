import qs from 'query-strings-parser'
import { inject, injectable } from 'inversify'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ObjectIdValidator } from '../../application/domain/validator/object.id.validator'
import { User } from '../../application/domain/model/user'
import { IUserRepository } from 'application/port/user.repository.interface'
import { ILogger } from '../../utils/custom.logger'
import { Query } from '../../infrastructure/repository/query/query'
import { IQuery } from '../../application/port/query.interface'
import { Strings } from '../../utils/strings'
import { Admin } from '../../application/domain/model/admin'
import { IAdminRepository } from '../../application/port/admin.repository.interface'
import { Client } from '../../application/domain/model/client'
import { Employee } from '../../application/domain/model/employee'
import { IEmployeeRepository } from '../../application/port/employee.repository.interface'
import { IClientRepository } from '../../application/port/client.repository.interface'

@injectable()
export class RpcServerEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.EMPLOYEE_REPOSITORY) private readonly _employeeRepository: IEmployeeRepository,
        @inject(Identifier.CLIENT_REPOSITORY) private readonly _clientRepository: IClientRepository,
        @inject(Identifier.ADMIN_REPOSITORY) private readonly _adminRepository: IAdminRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this.initializeServer()
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err: any) {
            return Promise.reject(new Error(`Error stopping RPC Server! ${err.message}`))
        }
    }

    private initializeServer(): void {
        this.provideUserResources()
        this.provideAdminResources()
        this.provideEmployeeResources()
        this.provideClientResources()
    }

    private provideUserResources(): void {
        // Providing users.findone.
        this._eventBus
            .provideResource('users.findone', async (userId: string) => {
                try {
                    ObjectIdValidator.validate(userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
                    const user: User | undefined = await this._userRepository.findById(userId)
                    return user?.toJSON()
                } catch (err) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource users.findone successful registered'))
            .catch((err) => this._logger.error(`Error at register resource users.findone: ${err.message}`))

        // Providing users.find
        this._eventBus
            .provideResource('users.find', async (_query?: string) => {
                try {
                    const query: IQuery = this.buildQS(_query)
                    const users: Array<User> = await this._userRepository.find(query)
                    return users.map(item => item.toJSON())
                } catch (err) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource users.find successful registered'))
            .catch((err) => this._logger.error(`Error at register resource users.find: ${err.message}`))
    }

    private provideAdminResources(): void {
        // Providing admin.findone.
        this._eventBus
            .provideResource('admin.findone', async (adminId: string) => {
                try {
                    ObjectIdValidator.validate(adminId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
                    const admin: Admin | undefined = await this._adminRepository.findById(adminId)
                    return admin?.toJSON()
                } catch (err) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource admin.findone successful registered'))
            .catch((err) => this._logger.error(`Error at register resource admin.findone: ${err.message}`))
    }

    private provideEmployeeResources(): void {
        // Providing employee.findone.
        this._eventBus
            .provideResource('employee.findone', async (employeeId: string) => {
                try {
                    ObjectIdValidator.validate(employeeId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
                    const employee: Employee | undefined = await this._employeeRepository.findById(employeeId)
                    return employee?.toJSON()
                } catch (err) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource employee.findone successful registered'))
            .catch((err) => this._logger.error(`Error at register resource employee.findone: ${err.message}`))
    }

    private provideClientResources(): void {
        // Providing client.findone.
        this._eventBus
            .provideResource('client.findone', async (clientId: string) => {
                try {
                    ObjectIdValidator.validate(clientId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
                    const client: Client | undefined = await this._clientRepository.findById(clientId)
                    return client?.toJSON()
                } catch (err) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource client.findone successful registered'))
            .catch((err) => this._logger.error(`Error at register resource client.findone: ${err.message}`))
    }

    /**
     * Builds the query string based on defaults parameters and values.
     *
     * @param query
     */
    private buildQS(query?: any): IQuery {
        return new Query().fromJSON(
            qs.parser(query ? query : {}, { pagination: { limit: Number.MAX_SAFE_INTEGER } },
                { use_page: true })
        )
    }
}
