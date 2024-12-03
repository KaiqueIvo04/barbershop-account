import 'reflect-metadata'
import { Container } from 'inversify'
import { Identifier } from './identifiers'
import { ConnectionFactoryMongodb } from '../infrastructure/database/connection.factory.mongodb'
import { ConnectionMongodb } from '../infrastructure/database/connection.mongodb'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IConnectionFactory } from '../infrastructure/port/connection.factory.interface'
import { BackgroundService } from '../background/background.service'

import { App } from '../app'
import { CustomLogger, ILogger } from '../utils/custom.logger'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { ConnectionFactoryRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { IConnectionEventBus } from '../infrastructure/port/connection.event.bus.interface'
import { ConnectionRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { EventBusRabbitMQ } from '../infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IntegrationEventRepository } from '../infrastructure/repository/integration.event.repository'
import { IIntegrationEventRepository } from '../application/port/integration.event.repository.interface'
import { IntegrationEventRepoModel } from '../infrastructure/database/schema/integration.event.schema'
import { PublishEventBusTask } from '../background/task/publish.event.bus.task'
import { UserRepoModel } from '../infrastructure/database/schema/user.schema'
import { User } from '../application/domain/model/user'
import { UserEntity } from '../infrastructure/database/entity/user.entity'
import { UserEntityMapper } from '../infrastructure/database/entity/mapper/user.entity.mapper'
import { IEntityMapper } from '../infrastructure/port/entity.mapper.interface'
import { IUserRepository } from 'application/port/user.repository.interface'
import { UserRepository } from '../infrastructure/repository/user.repository'
import { UsersController } from '../ui/controllers/users.controller'
import { IUserService } from '../application/port/user.service.interface'
import { UserService } from 'application/service/user.service'
import { SubscribeEventBusTask } from '../background/task/subscribe.event.bus.task'
import { RpcServerEventBusTask } from '../background/task/rpc.server.event.bus.task'
import { FileController } from '../ui/controllers/file.controller'
import { FileService } from '../application/service/admin.service'
import { Client } from 'application/domain/model/client'
import { Admin } from 'application/domain/model/admin'
import { AdminEntity } from 'infrastructure/database/entity/admin.entity'
import { ClientEntity } from 'infrastructure/database/entity/client.entity'
import { Employee } from 'application/domain/model/employee'
import { EmployeeEntity } from 'infrastructure/database/entity/employee.entity'
import { ClientEntityMapper } from 'infrastructure/database/entity/mapper/client.entity.mapper'
import { EmployeeEntityMapper } from 'infrastructure/database/entity/mapper/employee.entity.mapper'
import { IClientRepository } from 'application/port/client.repository.interface'
import { ClientRepository } from 'infrastructure/repository/client.repository'
import { IEmployeeRepository } from 'application/port/employee.repository.interface'
import { EmployeeRepository } from 'infrastructure/repository/employee.repository'
import { IGatewayRepository } from 'application/port/gateway.repository.interface'
import { GatewayRepository } from 'infrastructure/repository/gateway.repository'
import { IAuthRepository } from 'application/port/auth.repository.interface'
import { AuthRepository } from 'infrastructure/repository/auth.repository'

class IoC {
    private readonly _container: Container

    /**
     * Creates an instance of Di.
     * @private
     */
    constructor() {
        this._container = new Container()
        this.initDependencies()
    }

    /**
     * Get Container inversify.
     *
     * @returns {Container}
     */
    get container(): Container {
        return this._container
    }

    /**
     * Initializes injectable containers.
     *
     * @private
     * @return void
     */
    private initDependencies(): void {
        this._container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this._container
            .bind<UserController>(Identifier.USER_CONTROLLER)
            .to(UsersController).inSingletonScope()
            começar no controller do admin

        // Services
        this._container
            .bind<IUserService>(Identifier.USER_SERVICE)
            .to(UserService).inSingletonScope()
 
        // Repositories Ok
        this._container
            .bind<IIntegrationEventRepository>(Identifier.INTEGRATION_EVENT_REPOSITORY)
            .to(IntegrationEventRepository).inSingletonScope()
        this._container
            .bind<IGatewayRepository>(Identifier.GATEWAY_REPOSITORY)
            .to(GatewayRepository).inSingletonScope()
        this._container
            .bind<IAuthRepository>(Identifier.AUTH_REPOSITORY)
            .to(AuthRepository).inSingletonScope()
        this._container
            .bind<IUserRepository>(Identifier.USER_REPOSITORY)
            .to(UserRepository).inSingletonScope()
        this._container
            .bind<IClientRepository>(Identifier.CLIENT_REPOSITORY)
            .to(ClientRepository).inSingletonScope()
        this._container
            .bind<IEmployeeRepository>(Identifier.EMPLOYEE_REPOSITORY)
            .to(EmployeeRepository).inSingletonScope()

        // Models Ok
        this._container.bind(Identifier.INTEGRATION_EVENT_REPO_MODEL).toConstantValue(IntegrationEventRepoModel)
        this._container.bind(Identifier.USER_REPO_MODEL).toConstantValue(UserRepoModel)

        // Mappers Ok
        this._container
            .bind<IEntityMapper<User, UserEntity>>(Identifier.USER_ENTITY_MAPPER)
            .to(UserEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Admin, AdminEntity>>(Identifier.ADMIN_ENTITY_MAPPER)
            .to(UserEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Client, ClientEntity>>(Identifier.CLIENT_ENTITY_MAPPER)
            .to(ClientEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Employee, EmployeeEntity>>(Identifier.EMPLOYEE_ENTITY_MAPPER)
            .to(EmployeeEntityMapper).inSingletonScope()

        // Background Services
        this._container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongodb).inSingletonScope()
        this._container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongodb).inSingletonScope()
        this._container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()
        this._container
            .bind<IConnectionFactory>(Identifier.RABBITMQ_CONNECTION_FACTORY)
            .to(ConnectionFactoryRabbitMQ).inSingletonScope()
        this._container
            .bind<IConnectionEventBus>(Identifier.RABBITMQ_CONNECTION)
            .to(ConnectionRabbitMQ)
        this._container
            .bind<IEventBus>(Identifier.RABBITMQ_EVENT_BUS)
            .to(EventBusRabbitMQ).inSingletonScope()

        // Tasks
        this._container
            .bind<IBackgroundTask>(Identifier.PUBLISH_EVENT_BUS_TASK)
            .to(PublishEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.SUBSCRIBE_EVENT_BUS_TASK)
            .to(SubscribeEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.RPC_SERVER_EVENT_BUS_TASK)
            .to(RpcServerEventBusTask).inRequestScope()

        // Logs
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}

export const DIContainer = new IoC().container
