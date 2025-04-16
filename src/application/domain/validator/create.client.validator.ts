// import { ValidationException } from '../exception/validation.exception'
import { Client } from '../model/client'
import { CreateUserValidator } from './create.user.validator'
import { ValidationException } from '../exception/validation.exception'
// import { Strings } from '../../../utils/strings'
// import { StringValidator } from './string.validator'

export class CreateClientValidator extends CreateUserValidator{
    public static validate(client: Client): void | ValidationException{
        // Generic User Fields
        CreateUserValidator.validate(client)
    }
}
