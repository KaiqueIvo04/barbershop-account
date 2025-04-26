import { ValidationException } from '../exception/validation.exception'
// import { UpdateUserValidator } from './update.user.validator'
import { UserParamsValidator } from './user.params.validator'
import { ObjectIdValidator } from './object.id.validator'
import { PhoneValidator } from './phone.validator'
import { EmailValidator } from './email.validator'
import { Strings } from '../../../utils/strings'
import { StringValidator } from './string.validator'
import { Employee } from '../model/employee'

export class UpdateEmployeeValidator{
    public static validate(employee: Employee): void | ValidationException {
        if (employee.id) {
            try {
                ObjectIdValidator.validate(employee.id)
            } catch (err) {
                throw new ValidationException('USER_ID_INVALID')
            }
        }
        if (employee.name !== undefined) UserParamsValidator.validateName(employee.name)
        if (employee.contact_personal !== undefined) PhoneValidator.validate(employee.contact_personal, true)
        if (employee.email !== undefined && employee.email !== '') EmailValidator.validate(employee.email)
        if (employee.role !== undefined) StringValidator.validate(employee.role, 'role', false, false)

        // When parameters cannot be updated.
        if (employee.password !== undefined) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.PARAMETER_CANNOT_BE_UPDATED.replace('{0}', 'password'),
                Strings.ERROR_MESSAGE.PASSWORD_CANNOT_BE_UPDATED_DESC
            )
        }
    }
}
