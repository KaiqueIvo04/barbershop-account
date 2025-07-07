import { Employee } from '../../../src/application/domain/model/employee'
import { DefaultFunctions } from '../utils/default.functions'

export class EmployeeMock {
    public static generate(): Employee {
        const employee: Employee = new Employee()
        employee.id = DefaultFunctions.generateObjectId()
        employee.name = 'Employee mock'
        employee.contact_personal = '(83) 98888-8100'
        employee.email = 'employee@mock.com'
        employee.password = '123456'
        employee.responsible_admin_id = DefaultFunctions.generateObjectId()
        employee.type = 'employee'
        employee.last_login = new Date()
        employee.protected = false
        employee.role = 'Barber'
        employee.avaliable = true
        return employee
    }
}