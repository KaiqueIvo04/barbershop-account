import { IRepository } from './repository.interface'
import { Employee } from 'application/domain/model/employee'

/**
 * Interface of the Employee repository.
 * Must be implemented by the Employee repository at the infrastructure layer.
 *
 * @extends {IRepository<Employee>}
 */

export interface IEmployeeRepository extends IRepository<Employee> {
}
