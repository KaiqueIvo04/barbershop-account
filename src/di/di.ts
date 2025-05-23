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
import { UserEntity } from '../infrastructure/entity/user.entity'
import { UserEntityMapper } from '../infrastructure/entity/mapper/user.entity.mapper'
import { IEntityMapper } from '../infrastructure/port/entity.mapper.interface'
import { IUserRepository } from 'application/port/user.repository.interface'
import { UserRepository } from '../infrastructure/repository/user.repository'
import { UsersController } from '../ui/controllers/users.controller'
import { IUserService } from '../application/port/user.service.interface'
import { UserService } from '../application/service/user.service'
import { IAdminService } from '../application/port/admin.service.interface'
import { AdminService } from '../application/service/admin.service'
import { RegisterDefaultAdminTask } from '../background/task/register.default.admin.task'
import { RpcServerEventBusTask } from '../background/task/rpc.server.event.bus.task'
import { IAdminRepository } from '../application/port/admin.repository.interface'
import { AdminRepository } from '../infrastructure/repository/admin.repository'
import { Client } from '../application/domain/model/client'
import { Admin } from '../application/domain/model/admin'
import { AdminEntity } from '../infrastructure/entity/admin.entity'
import { AdminEntityMapper } from '../infrastructure/entity/mapper/admin.entity.mapper'
import { ClientEntity } from '../infrastructure/entity/client.entity'
import { Employee } from '../application/domain/model/employee'
import { EmployeeEntity } from '../infrastructure/entity/employee.entity'
import { ClientEntityMapper } from '../infrastructure/entity/mapper/client.entity.mapper'
import { EmployeeEntityMapper } from '../infrastructure/entity/mapper/employee.entity.mapper'
import { IClientRepository } from '../application/port/client.repository.interface'
import { ClientRepository } from '../infrastructure/repository/client.repository'
import { IEmployeeRepository } from '../application/port/employee.repository.interface'
import { EmployeeRepository } from '../infrastructure/repository/employee.repository'
// import { IGatewayRepository } from '../application/port/gateway.repository.interface'
// import { GatewayRepository } from '../infrastructure/repository/gateway.repository'
import { IAuthRepository } from '../application/port/auth.repository.interface'
import { AuthRepository } from '../infrastructure/repository/auth.repository'
import { AdminController } from '../ui/controllers/admin.controller'
import { ClientController } from '../ui/controllers/client.controller'
import { ClientService } from '../application/service/client.service'
import { IClientService } from '../application/port/client.service.interface'
import { EmployeeController } from '../ui/controllers/employee.controller'
import { IEmployeeService } from '../application/port/employee.service.interface'
import { EmployeeService } from '../application/service/employee.service'
import { IAuthService } from '../application/port/auth.service.interface'
import { AuthService } from '../application/service/auth.service'
import { AuthController } from '../ui/controllers/auth.controller'

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
            .bind<UsersController>(Identifier.USERS_CONTROLLER)
            .to(UsersController).inSingletonScope()
        this._container
            .bind<AdminController>(Identifier.ADMIN_CONTROLLER)
            .to(AdminController).inSingletonScope()
        this._container
            .bind<ClientController>(Identifier.CLIENT_CONTROLLER)
            .to(ClientController).inSingletonScope()
        this._container
            .bind<EmployeeController>(Identifier.EMPLOYEE_CONTROLLER)
            .to(EmployeeController).inSingletonScope()
        this._container
            .bind<AuthController>(Identifier.AUTH_CONTROLLER)
            .to(AuthController).inSingletonScope()

        // Services
        this._container
             .bind<IUserService>(Identifier.USER_SERVICE)
             .to(UserService).inSingletonScope()
        this._container
            .bind<IAdminService>(Identifier.ADMIN_SERVICE)
            .to(AdminService).inSingletonScope()
        this._container
            .bind<IClientService>(Identifier.CLIENT_SERVICE)
            .to(ClientService).inSingletonScope()
        this._container
            .bind<IEmployeeService>(Identifier.EMPLOYEE_SERVICE)
            .to(EmployeeService).inSingletonScope()
        this._container
            .bind<IAuthService>(Identifier.AUTH_SERVICE)
            .to(AuthService).inSingletonScope()

        // Repositories Ok
        this._container
            .bind<IIntegrationEventRepository>(Identifier.INTEGRATION_EVENT_REPOSITORY)
            .to(IntegrationEventRepository).inSingletonScope()
    //     this._container
    //         .bind<IGatewayRepository>(Identifier.GATEWAY_REPOSITORY)
    //         .to(GatewayRepository).inSingletonScope()
    //     this._container
    //         .bind<IAuthRepository>(Identifier.AUTH_REPOSITORY)
    //         .to(AuthRepository).inSingletonScope()
        this._container
            .bind<IUserRepository>(Identifier.USER_REPOSITORY)
            .to(UserRepository).inSingletonScope()
        this._container
            .bind<IAdminRepository>(Identifier.ADMIN_REPOSITORY)
            .to(AdminRepository).inSingletonScope()
        this._container
            .bind<IClientRepository>(Identifier.CLIENT_REPOSITORY)
            .to(ClientRepository).inSingletonScope()
        this._container
            .bind<IEmployeeRepository>(Identifier.EMPLOYEE_REPOSITORY)
            .to(EmployeeRepository).inSingletonScope()
        this._container
            .bind<IAuthRepository>(Identifier.AUTH_REPOSITORY)
            .to(AuthRepository).inSingletonScope()

        // Models Ok
        this._container.bind(Identifier.INTEGRATION_EVENT_REPO_MODEL).toConstantValue(IntegrationEventRepoModel)
        this._container.bind(Identifier.USER_REPO_MODEL).toConstantValue(UserRepoModel)

        // Mappers Ok
        this._container
            .bind<IEntityMapper<User, UserEntity>>(Identifier.USER_ENTITY_MAPPER)
            .to(UserEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Admin, AdminEntity>>(Identifier.ADMIN_ENTITY_MAPPER)
            .to(AdminEntityMapper).inSingletonScope()
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
            .bind<IBackgroundTask>(Identifier.REGISTER_DEFAULT_ADMIN_TASK)
            .to(RegisterDefaultAdminTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.RPC_SERVER_EVENT_BUS_TASK)
            .to(RpcServerEventBusTask).inRequestScope()

        // Logs
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}

export const DIContainer = new IoC().container
