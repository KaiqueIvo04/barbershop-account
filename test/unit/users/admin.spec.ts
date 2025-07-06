import { expect } from 'chai'
import { describe, it } from 'mocha'
import { CreateAdminValidator } from '../../../src/application/domain/validator/create.admin.validator'
import { UpdateAdminValidator } from '../../../src/application/domain/validator/update.admin.validator'
import { Admin } from '../../../src/application/domain/model/admin'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'
import { AdminMock } from '../../mocks/models/admin.mock'


describe('Admin Validator Tests', () => {
    /**
     * Validation tests for CreateAdminValidator
     */
    describe('CreateAdminValidator', () => {
        // Must be Fail
        it('should throw ValidationException when required fields is missing', () => {
            const admin = new Admin().fromJSON(AdminMock.generate())
            admin.name = undefined
            admin.email = undefined
            admin.password = undefined

            expect(() => CreateAdminValidator.validate(admin)).to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
        })

        it('should throw ValidationException when email is invalid', () => {
            const admin = new Admin().fromJSON(AdminMock.generate())
            admin.email = 'eadmin.com'

            expect(() => CreateAdminValidator.validate(admin)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when name is invalid', () => {
            const admin = new Admin().fromJSON(AdminMock.generate())
            admin.name = ''

            expect(() => CreateAdminValidator.validate(admin)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when password is invalid', () => {
            const admin = new Admin().fromJSON(AdminMock.generate())
            admin.password = '1234'

            expect(() => CreateAdminValidator.validate(admin)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when contact_personal is invalid', () => {
            const admin = new Admin().fromJSON(AdminMock.generate())
            admin.contact_personal = '94616218'

            expect(() => CreateAdminValidator.validate(admin)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        // Must be Pass
        it('should pass validation when all required fields are valid', () => {
            const admin = new Admin().fromJSON(AdminMock.generate())

            expect(() => CreateAdminValidator.validate(admin)).not.to.throw(ValidationException)
        })
    })

    describe('UpdateAdminValidator', () => {
        // Must be Fail
        it('should throw ValidationException if id is not in valid format', () => {
            const admin = new Admin()
            admin.id = 'invalid_id'

            expect(() => UpdateAdminValidator.validate(admin)).to.throw(ValidationException, Strings.ADMIN.PARAM_ID_NOT_VALID_FORMAT);
        })

        it('should throw ValidationException when email is invalid', () => {
            const admin = new Admin().fromJSON(AdminMock.generate())
            admin.email = 'invalidemail.com'

            expect(() => UpdateAdminValidator.validate(admin)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when name is invalid', () => {
            const admin = new Admin().fromJSON(AdminMock.generate())
            admin.name = 'ab'

            expect(() => UpdateAdminValidator.validate(admin)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when password is invalid', () => {
            const admin = new Admin().fromJSON(AdminMock.generate())
            admin.password = '1234'

            expect(() => UpdateAdminValidator.validate(admin)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when contact_personal is invalid', () => {
            const admin = new Admin().fromJSON(AdminMock.generate())
            admin.contact_personal = 'invalid_contact'

            expect(() => UpdateAdminValidator.validate(admin)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        // Must be Pass
        it('should pass validation when all required fields are valid', () => {
            const admin = new Admin().fromJSON(AdminMock.generate())
            admin.password = undefined //Password can't be updated by this method

            expect(() => UpdateAdminValidator.validate(admin)).not.to.throw(ValidationException)
        })
    })

})