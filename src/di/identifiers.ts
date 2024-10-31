/**
 * Constants used in dependence injection.
 *
 * @abstract
 */
export abstract class Identifier {
    public static readonly APP: any = Symbol.for('App')

    // Controllers
    public static readonly USERS_CONTROLLER: any = Symbol.for('UsersController')
    public static readonly ADMIN_CONTROLLER: any = Symbol.for('AdminController')
    public static readonly CLIENT_CONTROLLER: any = Symbol.for('ClientController')
    public static readonly EMPLOYEE_CONTROLLER: any = Symbol.for('EmployeeController')
    public static readonly AUTH_CONTROLLER: any = Symbol.for('AuthController')

    // Services
    public static readonly USER_SERVICE: any = Symbol.for('UserService')
    public static readonly ADMIN_SERVICE: any = Symbol.for('AdminService')
    public static readonly CLIENT_SERVICE: any = Symbol.for('ClientService')
    public static readonly EMPLOYEE_SERVICE: any = Symbol.for('EmployeeService')
    public static readonly AUTH_SERVICE: any = Symbol.for('AuthService')

    // Repositories
    public static readonly AUTH_REPOSITORY: any = Symbol.for('AuthRepository')
    public static readonly GATEWAY_REPOSITORY: any = Symbol.for('GatewayRepository')
    public static readonly USER_REPOSITORY: any = Symbol.for('UserRepository')
    public static readonly INTEGRATION_EVENT_REPOSITORY: any = Symbol.for('IntegrationEventRepository')
    public static readonly ADMIN_REPOSITORY: any = Symbol.for('AdminRepository')
    public static readonly CLIENT_REPOSITORY: any = Symbol.for('ClientRepository')
    public static readonly EMPLOYEE_REPOSITORY: any = Symbol.for('EmployeeRepository')

    // Models
    public static readonly INTEGRATION_EVENT_REPO_MODEL: any = Symbol.for('IntegrationEventRepoModel')
    public static readonly USER_REPO_MODEL: any = Symbol.for('UserRepoModel')

    // Mappers
    public static readonly USER_ENTITY_MAPPER: any = Symbol.for('UserEntityMapper')
    public static readonly ADMIN_ENTITY_MAPPER: any = Symbol.for('AdminEntityMapper')
    public static readonly CLIENT_ENTITY_MAPPER: any = Symbol.for('ClientEntityMapper')
    public static readonly EMPLOYEE_ENTITY_MAPPER: any = Symbol.for('EmployeeEntityMapper')

    // Background Services
    public static readonly MONGODB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryMongodb')
    public static readonly MONGODB_CONNECTION: any = Symbol.for('ConnectionMongodb')
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')
    public static readonly RABBITMQ_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryRabbitMQ')
    public static readonly RABBITMQ_CONNECTION: any = Symbol.for('ConnectionRabbitMQ')
    public static readonly RABBITMQ_EVENT_BUS: any = Symbol.for('EventBusRabbitMQ')

    // Tasks
    public static readonly REGISTER_DEFAULT_ADMIN_TASK: any = Symbol.for('RegisterDefaultAdminTask')
    public static readonly PUBLISH_EVENT_BUS_TASK: any = Symbol.for('PublishEventBusTask')
    public static readonly SUBSCRIBE_EVENT_BUS_TASK: any = Symbol.for('SubscribeEventBusTask')
    public static readonly RPC_SERVER_EVENT_BUS_TASK: any = Symbol.for('RpcServerEventBusTask')

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
