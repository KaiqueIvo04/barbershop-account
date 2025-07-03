import { expect } from 'chai'
import { describe, it } from 'mocha'
import { CreateAdminValidator } from '../../../src/application/domain/validator/create.admin.validator'
// import { UpdateAdminValidator } from '../../../src/application/domain/validator/update.admin.validator'
import { Admin } from '../../../src/application/domain/model/admin'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'
import { AdminMock } from '../../mocks/models/admin.mock'


describe('Admin Validator Tests', () => {
    /**
     * Validation tests for CreateAdminValidator
     */
    describe('CreateAdminValidator', () => {
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
    })

})