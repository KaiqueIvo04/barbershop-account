import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'

export class TextFieldsValidator {
    public static validateTextField(text: string, min: number, max: number, field: string, allowEmpty?: boolean)
        : void | ValidationException {

        if (typeof text !== 'string') {
            throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_STRING.replace('{0}', field))
        } else if ((!allowEmpty || text !== '') && (text.trim().length < min || text.trim().length > max)) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_TEXT_FIELD
                    .replace('{0}', field).replace('{1}', min).replace('{2}', max)
            )
        }
    }
}
