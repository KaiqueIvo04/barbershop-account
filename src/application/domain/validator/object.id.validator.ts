import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'

export class ObjectIdValidator {
    public static validate(uuid: string, message?: string, allowEmpty?: boolean): void | ValidationException {
        if (!(allowEmpty && uuid === '') && !(/^[a-fA-F0-9]{24}$/.test(uuid))) {
            throw new ValidationException(message ? message : Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT,
                Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
        }
    }
}