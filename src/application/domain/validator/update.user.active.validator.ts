import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'
import { User } from '../model/user'
import { BooleanValidator } from './boolean.validator'

export class UpdateUserActiveValidator {
    public static validate(user: User, active: boolean | undefined): void | ValidationException {
        if (active === undefined) {
            throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', 'active'))
        } else {
            BooleanValidator.validate(active, 'active')
        }
    }
}
