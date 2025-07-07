import { expect } from 'chai'
import { describe, it } from 'mocha'
import { CreateClientValidator } from '../../../src/application/domain/validator/create.client.validator'
import { UpdateClientValidator } from '../../../src/application/domain/validator/update.client.validator'
import { Client } from '../../../src/application/domain/model/client'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'
import { ClientMock } from '../../mocks/models/client.mock'


describe('Client Validator Tests', () => {
    /**
     * Validation tests for CreateClientValidator
     */
    describe('CreateClientValidator', () => {
        // Must be Fail
        it('should throw ValidationException when required fields is missing', () => {
            const client = new Client().fromJSON(ClientMock.generate())
            client.name = undefined
            client.email = undefined
            client.password = undefined

            expect(() => CreateClientValidator.validate(client)).to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
        })

        it('should throw ValidationException when email is invalid', () => {
            const client = new Client().fromJSON(ClientMock.generate())
            client.email = 'eclient.com'

            expect(() => CreateClientValidator.validate(client)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when name is invalid', () => {
            const client = new Client().fromJSON(ClientMock.generate())
            client.name = ''

            expect(() => CreateClientValidator.validate(client)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when password is invalid', () => {
            const client = new Client().fromJSON(ClientMock.generate())
            client.password = '1234'

            expect(() => CreateClientValidator.validate(client)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when contact_personal is invalid', () => {
            const client = new Client().fromJSON(ClientMock.generate())
            client.contact_personal = '94616218'

            expect(() => CreateClientValidator.validate(client)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        // Must be Pass
        it('should pass validation when all required fields are valid', () => {
            const client = new Client().fromJSON(ClientMock.generate())

            expect(() => CreateClientValidator.validate(client)).not.to.throw(ValidationException)
        })
    })

    describe('UpdateClientValidator', () => {
        // Must be Fail
        it('should throw ValidationException if id is not in valid format', () => {
            const client = new Client()
            client.id = 'invalid_id'

            expect(() => UpdateClientValidator.validate(client)).to.throw(ValidationException, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);
        })

        it('should throw ValidationException when email is invalid', () => {
            const client = new Client().fromJSON(ClientMock.generate())
            client.email = 'invalidemail.com'

            expect(() => UpdateClientValidator.validate(client)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when name is invalid', () => {
            const client = new Client().fromJSON(ClientMock.generate())
            client.name = 'ab'

            expect(() => UpdateClientValidator.validate(client)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when password is invalid', () => {
            const client = new Client().fromJSON(ClientMock.generate())
            client.password = '1234'

            expect(() => UpdateClientValidator.validate(client)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when contact_personal is invalid', () => {
            const client = new Client().fromJSON(ClientMock.generate())
            client.contact_personal = 'invalid_contact'

            expect(() => UpdateClientValidator.validate(client)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        // Must be Pass
        it('should pass validation when all required fields are valid', () => {
            const client = new Client().fromJSON(ClientMock.generate())
            client.password = undefined //Password can't be updated by this method

            expect(() => UpdateClientValidator.validate(client)).not.to.throw(ValidationException)
        })
    })
})