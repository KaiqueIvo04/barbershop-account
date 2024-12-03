import { ValidationException } from '../exception/validation.exception'
import { TextFieldsValidator } from './text.fields.validator'

export class UserParamsValidator {
    public static validateName(name: string): void | ValidationException {
        TextFieldsValidator.validateTextField(name, 2, 90, 'name')
    }

    public static validatePassword(password: string, fieldName: string): void | ValidationException {
        TextFieldsValidator.validateTextField(password, 6, 30, fieldName)
    }
}