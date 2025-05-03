import { ValidationException } from '../exception/validation.exception'
import { Credentials } from '../model/credentials'
import { StringValidator } from './string.validator'
import { Strings } from '../../../utils/strings'
import { EmailValidator } from './email.validator'
// import { CpfValidator } from './cpf.validator'
// import { NumericStringValidator } from './numeric.string.validator'

export class CredentialsValidator {
    public static validate(auth: Credentials): void | ValidationException {
        const fields: Array<string> = []

        if (!auth.email) {
            fields.push('email')
        }

        // const identifiers = [auth.email].filter(Boolean)
        // if (identifiers.length > 1) {
        //     throw new ValidationException(
        //         Strings.ERROR_MESSAGE.VALIDATE.MULTIPLE_IDENTIFIERS,
        //         Strings.ERROR_MESSAGE.VALIDATE.MULTIPLE_IDENTIFIERS_DESC
        //     )
        // }

        if (auth.email) EmailValidator.validate(auth.email)
        // if (auth.cpf) CpfValidator.validate(auth.cpf)
        // if (auth.cnpj) NumericStringValidator.validate(auth.cnpj, 'cnpj')

        if (!auth.password) fields.push('password')
        else StringValidator.validate(auth.password, 'password', false, true)

        if (fields.length > 0) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', '))
            )
        }
    }
}
