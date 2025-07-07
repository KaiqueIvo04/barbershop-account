import { expect } from 'chai'
import { describe, it } from 'mocha'
import { CreateEmployeeValidator } from '../../../src/application/domain/validator/create.employee.validator'
import { UpdateEmployeeValidator } from '../../../src/application/domain/validator/update.employee.validator'
import { Employee } from '../../../src/application/domain/model/employee'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'
import { EmployeeMock } from '../../mocks/models/employee.mock'


describe('Employee Validator Tests', () => {
    /**
     * Validation tests for CreateEmployeeValidator
     */
    describe('CreateEmployeeValidator', () => {
        // Must be Fail
        it('should throw ValidationException when required fields is missing', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.name = undefined
            employee.email = undefined
            employee.password = undefined

            expect(() => CreateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
        })

        it('should throw ValidationException when email is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.email = 'eemployee.com'

            expect(() => CreateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when name is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.name = ''

            expect(() => CreateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when password is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.password = '1234'

            expect(() => CreateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when contact_personal is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.contact_personal = '94616218'

            expect(() => CreateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when role is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.role = ''

            expect(() => CreateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when responsible_admin_id is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.responsible_admin_id = 'invalid_id'

            expect(() => CreateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        // Must be Pass
        it('should pass validation when all required fields are valid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())

            expect(() => CreateEmployeeValidator.validate(employee)).not.to.throw(ValidationException)
        })
    })

    describe('UpdateEmployeeValidator', () => {
        // Must be Fail
        it('should throw ValidationException if id is not in valid format', () => {
            const employee = new Employee()
            employee.id = 'invalid_id'

            expect(() => UpdateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.USER.PARAM_ID_NOT_VALID_FORMAT);
        })

        it('should throw ValidationException when email is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.email = 'invalidemail.com'

            expect(() => UpdateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when name is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.name = 'ab'

            expect(() => UpdateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when password is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.password = '1234'

            expect(() => UpdateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when contact_personal is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.contact_personal = 'invalid_contact'

            expect(() => UpdateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when role is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.role = 'x'

            expect(() => UpdateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when responsible_admin_id is invalid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.responsible_admin_id = 'invalid_admin_id'

            expect(() => UpdateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when avaliable is not boolean', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.avaliable = 'true' as any // Force invalid type

            expect(() => UpdateEmployeeValidator.validate(employee)).to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        // Must be Pass
        it('should pass validation when all required fields are valid', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.password = undefined //Password can't be updated by this method

            expect(() => UpdateEmployeeValidator.validate(employee)).not.to.throw(ValidationException)
        })

        it('should pass validation when avaliable is boolean', () => {
            const employee = new Employee().fromJSON(EmployeeMock.generate())
            employee.password = undefined
            employee.avaliable = true

            expect(() => UpdateEmployeeValidator.validate(employee)).not.to.throw(ValidationException)
        })
    })
})