import { CreateUserValidator } from './create.user.validator'
import { Admin } from '../model/admin'
import { ValidationException } from '../exception/validation.exception'
// import { StringValidator } from './string.validator'

export class CreateAdminValidator extends CreateUserValidator{
    public static validate(admin: Admin): void | ValidationException{
        // Generic User Fields
        CreateUserValidator.validate(admin)
    }
}
