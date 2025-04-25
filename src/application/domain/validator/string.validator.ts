import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'

export class StringValidator {
    public static validate(value: string, fieldName: string, allowEmpty?: boolean, allowNumeric?: boolean): void | ValidationException {
        if (typeof value !== 'string') {
            throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_STRING.replace('{0}', fieldName))
        } else if ((!allowEmpty || value !== '') && value.trim().length === 0) {
            throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.EMPTY_STRING.replace('{0}', fieldName))
        } else if (!allowNumeric && !isNaN(Number(value))) {
            throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_ALFABETIC_STRING.replace('{0}', fieldName))
        }
    }
}
