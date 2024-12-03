import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'
import { StringValidator } from './string.validator'

export class PhoneValidator {
    public static validate(phone: string, empty: boolean): void | ValidationException {
        StringValidator.validate(phone, 'phone', empty)

        if (empty && (!phone || phone.trim() === '')) return

        const validFormat = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/

        if (!validFormat.test(phone)) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_PHONE
            )
        }

        const aux = phone.replace(/[^0-9]/g, '')

        if (!/^\d{10,11}$/.test(aux)) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_PHONE
            )
        }
    }
}