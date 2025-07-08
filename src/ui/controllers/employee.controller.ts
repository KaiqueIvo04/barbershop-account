import { inject } from 'inversify'
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { Employee } from '../../application/domain/model/employee'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { UserType } from '../../application/domain/utils/user.types'
import { NotFoundException } from '../../application/domain/exception/not.found.exception'
import { Strings } from '../../utils/strings'
import { IEmployeeService } from '../../application/port/employee.service.interface'

@controller('/v1/employees')
export class EmployeeController {

    // private static handlerError(res: Response, err: any) {
    //     const handlerError = ApiExceptionManager.build(err)
    //     return res.status(handlerError.code)
    //         .send(handlerError.toJSON())
    // }

    constructor(
        @inject(Identifier.EMPLOYEE_SERVICE) private readonly _employeeService: IEmployeeService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpPost('/')
    public async saveEmployee(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const newEmployee: Employee = new Employee().fromJSON(req.body)
            newEmployee.id = undefined
            const result: Employee | undefined = await this._employeeService.add(newEmployee)

            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))

        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/')
    public async getAllEmployees(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ type: UserType.EMPLOYEE })
            const result: Array<Employee> = await this._employeeService.getAll(query)

            const count: number = await this._employeeService.count(query)
            res.setHeader('X-Total-Count', count)

            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/:employee_id')
    public async getEmployeeById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ _id: req.params.employee_id, type: UserType.EMPLOYEE })

            const result: Employee | undefined = await this._employeeService.getById(req.params.employee_id, query)

            if (!result) throw new NotFoundException(Strings.EMPLOYEE.NOT_FOUND, Strings.EMPLOYEE.NOT_FOUND_DESCRIPTION)

            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpPatch('/:employee_id')
    public async updateEmployeeById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const updateEmployee: Employee = new Employee().fromJSON(req.body)
            updateEmployee.id = req.params.employee_id

            const result: Employee | undefined = await this._employeeService.update(updateEmployee)

            if (!result) throw new NotFoundException(Strings.EMPLOYEE.NOT_FOUND, Strings.EMPLOYEE.NOT_FOUND_DESCRIPTION)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpDelete('/:employee_id')
    public async deleteEmpoyeeById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._employeeService.remove(req.params.employee_id)

            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    private toJSONView(employee: Employee | Array<Employee> | undefined): object {
        if (employee instanceof Array) return employee.map(item => item.toJSON())
        return employee?.toJSON()
    }
}
