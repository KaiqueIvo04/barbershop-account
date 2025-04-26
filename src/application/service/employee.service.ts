import { inject, injectable } from 'inversify'
import { IEmployeeService } from '../../application/port/employee.service.interface'
import { Identifier } from '../../di/identifiers'
import { IEmployeeRepository } from '../../application/port/employee.repository.interface'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { Employee } from '../../application/domain/model/employee'
import { UserType } from '../../application/domain/utils/user.types'
import { CreateEmployeeValidator } from '../../application/domain/validator/create.employee.validator'
import { ConflictException } from '../../application/domain/exception/conflict.exception'
import { Strings } from '../../utils/strings'
import { IQuery } from '../../application/port/query.interface'
import { ObjectIdValidator } from '../../application/domain/validator/object.id.validator'
import { UpdateEmployeeValidator } from '../../application/domain/validator/update.employee.validator'
import { NotFoundException } from '../../application/domain/exception/not.found.exception'

@injectable()
export class EmployeeService implements IEmployeeService {
    constructor(
        @inject(Identifier.EMPLOYEE_REPOSITORY) private readonly _employeeRepository: IEmployeeRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository
    ) {
    }

    public async add(employee: Employee): Promise<Employee | undefined> {
        try {
            console.log(employee)
            // 1. Check employee fields
            CreateEmployeeValidator.validate(employee)

            // 2. Check if employee already exists
            const employeeExists: boolean = await this._userRepository.checkExists(employee)
            if (employeeExists) throw new ConflictException(Strings.USER.ALREADY_REGISTERED)

            // 3. Check if responsible admin exists
            const responsibleAdminExists = await this._userRepository.findByIdAndType(
                employee.responsible_admin_id!, UserType.ADMIN
            )
            if (!responsibleAdminExists) throw new NotFoundException(
                Strings.EMPLOYEE.RESPONSIBLE_ADMIN_NOT_FOUND, Strings.EMPLOYEE.RESPONSIBLE_ADMIN_NOT_FOUND_DESCRIPTION
            )

            // if OK Create employee
            return this._employeeRepository.create(employee)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<Employee>> {
        return this._employeeRepository.find(query)
    }

    public async getById(id: string, query: IQuery): Promise<Employee | undefined> {
        try {
            ObjectIdValidator.validate(id, Strings.EMPLOYEE.PARAM_ID_NOT_VALID_FORMAT)

            return this._employeeRepository.findOne(query)
        } catch (err) {
            Promise.reject(err)
        }
    }

    public async update(employee: Employee): Promise<Employee | undefined> {
        try {
            // 1. Validate id parameter
            if (employee.id)
                ObjectIdValidator.validate(employee.id, Strings.EMPLOYEE.PARAM_ID_NOT_VALID_FORMAT)

            // 2. Check if user is registered
            const result = await this._userRepository.findByIdAndType(employee.id!, UserType.EMPLOYEE)
            if (!result) return Promise.resolve(undefined)

            UpdateEmployeeValidator.validate(employee)

            // 4. Check conficts
            if (employee.email) {
                const employeeExists: boolean = await this._userRepository.checkExists(employee)
                if (employeeExists) throw new ConflictException(Strings.USER.ALREADY_REGISTERED)
            }

            // 3.1 Preventing parameters from being updated
            employee.avaliable = undefined
            employee.responsible_admin_id = undefined

            // 5. Update user
            return this._employeeRepository.update(employee)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<boolean> {
        throw new Error('Unsupported feature!')
    }

    public count(query: IQuery): Promise<number> {
        return this._employeeRepository.count(query)
    }
}
