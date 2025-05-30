import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'

export class EmailValidator {
    public static validate(email: string | undefined): void | ValidationException {
        if (!email || !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).test(email)) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL
            )
        }
    }
}
