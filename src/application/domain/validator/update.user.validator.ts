import { ValidationException } from '../exception/validation.exception'
import { User } from '../model/user'
import { ObjectIdValidator } from './object.id.validator'
import { UserParamsValidator } from './user.params.validator'
import { Strings } from '../../../utils/strings'
import { EmailValidator } from './email.validator'
import { PhoneValidator } from './phone.validator'

export class UpdateUserValidator {
    public static validate(user: User): void | ValidationException {
        if (user.id) {
            try {
                ObjectIdValidator.validate(user.id)
            } catch (err) {
                throw new ValidationException('USER_ID_INVALID')
            }
        }
        if (user.name !== undefined) UserParamsValidator.validateName(user.name)
        if (user.contact_personal !== undefined) PhoneValidator.validate(user.contact_personal, true)
        if (user.email !== undefined && user.email !== '') EmailValidator.validate(user.email)

        // When parameters cannot be updated.
        if (user.password !== undefined) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.PARAMETER_CANNOT_BE_UPDATED.replace('{0}', 'password'),
                Strings.ERROR_MESSAGE.PASSWORD_CANNOT_BE_UPDATED_DESC
            )
        }
    }
}
