import { User } from '../model/user'
import { ValidationException } from '../exception/validation.exception'
import { UserParamsValidator } from './user.params.validator'
import { PhoneValidator } from './phone.validator'
import { EmailValidator } from './email.validator'
import { Strings } from '../../../utils/strings'

export class CreateUserValidator {
    public static validate(user: User) {
        const fields: Array<string> = []

        // Required fields
        if (user.name === undefined) fields.push('name')
        else UserParamsValidator.validateName(user.name)

        if (user.email === undefined) fields.push('email')
        else EmailValidator.validate(user.email)

        if (user.password === undefined) fields.push('password')
        else UserParamsValidator.validatePassword(user.password, 'password')

        // Optional fields
        if (user.contact_personal !== undefined) PhoneValidator.validate(user.contact_personal, false)

        if (fields.length > 0) throw new ValidationException(
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', '))
        )
    }
}
