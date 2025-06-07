import { IRepository } from './repository.interface'
import { Admin } from '../../application/domain/model/admin'

/**
 * Interface of the Admin repository.
 * Must be implemented by the Admin repository at the infrastructure layer.
 *
 * @extends {IRepository<Admin>}
 */

export interface IAdminRepository extends IRepository<Admin> {
}
