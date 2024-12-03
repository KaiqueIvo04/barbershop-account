import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'

export class BooleanValidator {
    public static validate(value: boolean, fieldName: string): void | ValidationException {
        if (typeof value !== 'boolean') {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_BOOLEAN.replace('{0}', fieldName)
            )
        }
    }
}