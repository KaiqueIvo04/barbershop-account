// import { ValidationException } from '../exception/validation.exception'
import { Employee } from '../model/employee'
import { UserParamsValidator } from './user.params.validator'
import { ValidationException } from '../exception/validation.exception'
import { EmailValidator } from './email.validator'
import { PhoneValidator } from './phone.validator'
import { StringValidator } from './string.validator'
import { BooleanValidator } from './boolean.validator'
import { ObjectIdValidator } from './object.id.validator'
import { Strings } from '../../../utils/strings'

export class CreateEmployeeValidator {
    public static validate(employee: Employee): void | ValidationException {
        const fields: Array<string> = []

        // Required fields
        if (employee.name === undefined) fields.push('name')
        else UserParamsValidator.validateName(employee.name)

        if (employee.email === undefined) fields.push('email')
        else EmailValidator.validate(employee.email)

        if (employee.password === undefined) fields.push('password')
        else UserParamsValidator.validatePassword(employee.password, 'password')

        if (employee.role === undefined) fields.push('role')
        else StringValidator.validate(employee.role, 'role', false, false)

        if (employee.responsible_admin_id === undefined) fields.push('responsible_admin_id')
        else ObjectIdValidator.validate(employee.responsible_admin_id)

        // Optional fields
        if (employee.contact_personal !== undefined) PhoneValidator.validate(employee.contact_personal, false)
        if (employee.avaliable !== undefined) BooleanValidator.validate(employee.avaliable, 'avaliable')

        if (fields.length > 0) throw new ValidationException(
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', '))
        )
    }
}
