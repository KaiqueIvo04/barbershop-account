import qs from 'query-strings-parser'
import { inject, injectable } from 'inversify'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ObjectIdValidator } from '../../application/domain/validator/object.id.validator'
import { User } from 'application/domain/model/user'
import { IUserRepository } from 'application/port/user.repository.interface'
import { ILogger } from '../../utils/custom.logger'
import { Query } from '../../infrastructure/repository/query/query'
import { IQuery } from '../../application/port/query.interface'
import { Strings } from '../../utils/strings'


@injectable()
export class RpcServerEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
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
