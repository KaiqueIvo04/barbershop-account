/**
 * Class that defines variables with default values.
 *
 * @see Variables defined in .env will have preference.
 * @see Be careful not to put critical data in this file as it is not in .gitignore.
 * Sensitive data such as database, passwords and keys should be stored in secure locations.
 *
 * @abstract
 */
export abstract class Strings {
    public static readonly OBJETO_ARQUIVO_INVALIDO = 'Objeto de arquivo inválido'
    public static readonly NAO_FOI_POSSIVEL_GRAVAR = 'Não foi possível gravar o arquivo no banco de dados'
    public static readonly ID_INVALIDO = 'ID inválido'
    public static readonly NENHUM_ARQUIVO_ENCONTRADO = 'Nenhum arquivo encontrado com este id'


    public static readonly APP: any = {
        TITLE: 'ACCOUNT SERVICE',
    }

    public static readonly USER: any = {
        ALREADY_REGISTERED: 'A user with this cpf or email is already registered!',
        NOT_FOUND: 'User not found!',
        NOT_FOUND_DESCRIPTION: 'User not found or already removed. A new operation for the same resource is required!',
        PASSWORD_NOT_MATCH: 'Password does not match!',
        PASSWORD_NOT_MATCH_DESCRIPTION: 'The old password parameter does not match with the actual user password.',
        PARAM_ID_NOT_VALID_FORMAT: 'Parameter {user_id} is not in valid format!'
    }

    public static readonly ADMIN: any = {
        NOT_FOUND: 'Admin not found!',
        NOT_FOUND_DESCRIPTION: 'Admin not found or already removed. A new operation for the same resource is required.',
        PARAM_ID_NOT_VALID_FORMAT: 'Parameter {admin_id} is not in valid format!'
    }

    public static readonly CLIENT: any = {
        NOT_FOUND: 'Client not found!',
        NOT_FOUND_DESCRIPTION: 'Client not found or already removed. A new operation for the same resource is required.',
        PARAM_ID_NOT_VALID_FORMAT: 'Parameter {client_id} is not in valid format!'
    }

    public static readonly EMPLOYEE: any = {
        NOT_FOUND: 'Employee not found!',
        NOT_FOUND_DESCRIPTION: 'Employee not found or already removed. A new operation for the same resource is required.',
        PARAM_ID_NOT_VALID_FORMAT: 'Parameter {employee_id} is not in valid format!',
        RESPONSIBLE_ADMIN_NOT_FOUND: 'Responsible admin not found!',
        RESPONSIBLE_ADMIN_NOT_FOUND_DESCRIPTION: 'Responsible admin not found or already removed. A new operation for the same resource is required.',
    }

    public static readonly ERROR_MESSAGE: any = {
        REQUEST_BODY_INVALID: 'Unable to process request body!',
        REQUEST_BODY_INVALID_DESC: 'Please verify that the JSON provided in the request body has a valid format and try again.',
        PROCEDURE_DISASSOCIATION_REQUIRED: 'It\'s necessary to disassociate the user from all procedure requests first!',
        ENDPOINT_NOT_FOUND: 'Endpoint {0} does not found!',
        UNEXPECTED: 'An unexpected error has occurred. Please try again later...',
        PARAMETER_CANNOT_BE_UPDATED: '{0} parameter cannot be updated.',
        PASSWORD_CANNOT_BE_UPDATED_DESC: 'A specific route to update user password already exists. ' +
            'Access PATCH /v1/auth/password to update your password.',
        OPERATION_CANT_BE_COMPLETED: 'The operation could not be performed successfully.',
        OPERATION_CANT_BE_COMPLETED_DESC: 'Probably one or more of the request parameters are incorrect.',
        INTERNAL_SERVER_ERROR: 'An internal server error has occurred.',
        INTERNAL_SERVER_ERROR_DESC: 'Check all parameters of the operation being requested.',
        VALIDATE: {
            REQUIRED_FIELDS: 'Required fields were not provided...',
            REQUIRED_FIELDS_DESC: '{0} are required!',
            UUID_NOT_VALID_FORMAT: 'Some ID provided does not have a valid format!',
            UUID_NOT_VALID_FORMAT_DESC: 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.',
            INVALID_FIELDS: 'One or more request fields are invalid...',
            INVALID_CPF: 'cpf must be a valid string of digits!',
            INVALID_PHONE_EXTENSION: 'phone_extension must be a valid string between 2 and 6 digits!',
            INVALID_PHONE: 'phone must be a valid 10 or 11-digit number!',
            INVALID_EMAIL: 'Invalid email address!',
            INVALID_STRING: '{0} must be a string!',
            EMPTY_STRING: '{0} must have at least one character!',
            INVALID_NUMERIC_STRING: '{0} must only have numeric digits!',
            INVALID_ALFABETIC_STRING: '{0} must only have alphabetic characters!',
            INVALID_ADDRESS_NUMBER: 'number must contains only letters, numbers and /.',
            INVALID_ZIP_CODE: 'zip_code must contains only 8 numbers.',
            INVALID_ZIP_CODE_NOT_FOUND: 'zip_code must be exists in VIA CEP endpoint.',
            INVALID_TEXT_FIELD: '{0} must contain a minimum of {1} and a maximum of {2} characters.',
            USER_CANNOT_BE_REMOVED: 'The operation could not be completed because the user in question cannot be removed.',
            INVALID_NAME_LENGTH: 'Invalid name length. Name must be between {0} and {1} characters long.',
            MISMATCH: 'The data does not match the expected values.',
            INVALID_PASSWORD_CONFIRMATION: 'Password and confirmation password do not match.',
            INVALID_PASSWORD_CONFIRMATION_DESC: 'password and confirm_password must be equal.'
        },
        DATE: {
            YEAR_NOT_ALLOWED: 'Date {0} has year not allowed. The year must be greater than 1678 and less than 2261.',
            INVALID_DATE_FORMAT: 'Date: {0}, is not in valid ISO 8601 format.',
            INVALID_DATE_FORMAT_DESC: 'Date must be in the format: yyyy-MM-dd',
            INVALID_DATETIME_FORMAT: 'Datetime: {0}, is not in valid ISO 8601 format.',
            INVALID_DATETIME_FORMAT_DESC: 'Datetime must be in the format: yyyy-MM-ddTHH:mm:ssZ'
        },
        EVENT_BUS: {
            DEFAULT_MESSAGE: 'An event bus error has occurred.',
            NO_CONNECTION_OPEN: 'No connection open!',
            UNEXPECTED_EVENT_NAME: 'Unexpected event name: {0}!'
        }
    }

    /**
     * @param param
     * @returns
     */
    public static stringsException(param: string) {
        return {
            ALREADY_REGISTERED: `A ${param.toLowerCase()} already registered!`,
            NOT_FOUND: `${param} not found!`,
            NOT_FOUND_DESCRIPTION: `${param} not found or already removed. A new operation for the same resource is required!`,
        }
    }
}
