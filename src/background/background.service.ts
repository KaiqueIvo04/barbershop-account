
import { inject, injectable } from 'inversify'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { Identifier } from '../di/identifiers'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { Config } from '../utils/config'
import { ILogger } from '../utils/custom.logger'

@injectable()
export class BackgroundService {

    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.MONGODB_CONNECTION) private readonly _mongodb: IConnectionDB,
        @inject(Identifier.REGISTER_DEFAULT_ADMIN_TASK) private readonly _defaultAdminTask: IBackgroundTask,
        @inject(Identifier.PUBLISH_EVENT_BUS_TASK) private readonly _publishTask: IBackgroundTask,
        @inject(Identifier.RPC_SERVER_EVENT_BUS_TASK) private readonly _rpcServerTask: IBackgroundTask,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async startServices(): Promise<void> {
        try {
            /**
             * At the time the application goes up, an event is issued if the
             * database is connected, and in this case, a task is run to check
             * if there are registered admin users.
             */
            this._mongodb.eventConnection.on('connected', async () => {
                await this._defaultAdminTask.run()
            })

            // Opens RabbitMQ connections to perform task.
            await this.openRabbitConnections()

            /**
             * Trying to connect to mongodb.
             * Go ahead only when the run is resolved.
             * Since the application depends on the database connection to work.
             */
            const dbConfigs = Config.getMongoConfig()
            await this._mongodb.tryConnect(dbConfigs.uri, dbConfigs.options)

        } catch (err: any) {
            return Promise.reject(new Error(`Error initializing services in background! ${err.message}`))
        }
    }

    public async stopServices(): Promise<void> {
        try {
            await this._mongodb.dispose()
            await this._eventBus.dispose()
        } catch (err: any) {
            return Promise.reject(new Error(`Error stopping services in background! ${err.message}`))
        }
    }

    private async openRabbitConnections(): Promise<void> {
        try {
            const rabbitConfigs = Config.getRabbitConfig()

            const pub = this._eventBus
                .connectionPub
                .open(rabbitConfigs.uri, rabbitConfigs.options)
                .then((conn) => {
                    this._logger.info('Publish connection established!')

                    conn.on('disconnected', () => this._logger.warn('Publish connection has been lost...'))
                    conn.on('reestablished', () => {
                        this._logger.info('Publish connection re-established!')
                        // When the connection has been lost and reestablished the task will be executed again.
                        this._publishTask.run()
                    })

                    this._publishTask.run()
                })
                .catch(err => {
                    this._logger.error(`Error trying to get connection to Event Bus for event publishing. ${err.message}`)
                })

            const rpcServer = this._eventBus
                .connectionRpcServer
                .open(rabbitConfigs.uri, rabbitConfigs.options)
                .then((conn) => {
                    this._logger.info('RPC Server connection established!')

                    conn.on('disconnected', () => this._logger.warn('RPC Server connection has been lost...'))
                    conn.on('reestablished', () => this._logger.info('RPC Server connection re-established!'))

                    this._rpcServerTask.run()
                })
                .catch(err => {
                    this._logger.error(`Error trying to get connection to Event Bus for RPC Server. ${err.message}`)
                })

            const rpcClient = this._eventBus
                .connectionRpcClient
                .open(rabbitConfigs.uri, rabbitConfigs.options)
                .then((conn) => {
                    this._logger.info('RPC Client connection established!')

                    conn.on('disconnected', () => this._logger.warn('RPC Client connection has been lost...'))
                    conn.on('reestablished', () => this._logger.info('RPC Client connection re-established!'))
                })
                .catch(err => {
                    this._logger.error(`Error trying to get connection to Event Bus for RPC Client. ${err.message}`)
                })
            await Promise.all([pub, rpcServer, rpcClient])
            return Promise.resolve()
        } catch (err: any) {
            return Promise.reject(new Error(`Error initializing rabbitmq connections! ${err.message}`))
        }
    }
}
