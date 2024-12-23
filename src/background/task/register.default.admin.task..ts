import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IQuery } from '../../application/port/query.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { UserType } from '../../application/domain/utils/user.types'
import { ILogger } from '../../utils/custom.logger'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Admin } from '../../application/domain/model/admin'
import { IAdminRepository } from '../../application/port/admin.repository.interface'
import { Default } from '../../utils/default'

/**
 * In this class it's checked whether there are any admin users in the database.
 * If there is no, a default user is created.
 *
 * This task is called every time the database connection is established / reestablished.
 *
 * NOTE: The user credentials must be set in the environment variables.
 * If you are in the development environment, to make it easier, use .env,
 * if it is in production, do not use, for your own security find a more
 * secure way to configure the credentials.
 */
@injectable()
export class RegisterDefaultAdminTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.ADMIN_REPOSITORY) private readonly _adminRepository: IAdminRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this.createUserAdmin().then()
    }

    private async createUserAdmin(): Promise<void> {
        const query: IQuery = new Query()
        query.filters = { type: UserType.ADMIN }
        try {
            const countUser = await this._adminRepository.count(query)
            if (!countUser) {
                const adminDefault = new Admin()
                adminDefault.name = 'Admin'
                adminDefault.email = process.env.ADMIN_EMAIL || Default.ADMIN_EMAIL
                adminDefault.password = process.env.ADMIN_PASSWORD || Default.ADMIN_PASSWORD
                // adminDefault.cpf = '67551249079'

                adminDefault.protected = true

                adminDefault.contact_personal = '(83) 3335-9987'

                const user = await this._adminRepository.create(adminDefault)
                if (!user) this._logger.error('Default admin user was not created!')
                else this._logger.info('Default admin user created successfully!')
            }
        } catch (err: any) {
            this._logger.error(`Error trying to create admin user: ${err.message} ${err.description}`)
            process.exit(1)
        }
    }

    public stop(): Promise<void> {
        return Promise.resolve()
    }
}
