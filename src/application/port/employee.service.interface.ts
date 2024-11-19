import { IService } from './service.interface'
import { Employee } from '../domain/model/employee'

/**
 * Employee service interface.
 */
export interface IEmployeeService extends IService<Employee> {
}