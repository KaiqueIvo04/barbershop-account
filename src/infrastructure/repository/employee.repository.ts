import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Identifier } from 'di/identifiers'
import { Query } from './query/query'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { IUserRepository } from 'application/port/user.repository.interface'
import { Employee } from 'application/domain/model/employee'
import { EmployeeEntity } from 'infrastructure/database/entity/employee.entity'
import { IEmployeeRepository } from 'application/port/employee.repository.interface'
import { UserType } from 'application/domain/utils/user.types'

/**
 * Implementation of the Employee repository.
 *
 * @implements {IEmployeeRepository}
 */
@injectable()
export class EmployeeRepository extends BaseRepository<Employee, EmployeeEntity> implements IEmployeeRepository {
    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _employeeModel: any,
        @inject(Identifier.EMPLOYEE_ENTITY_MAPPER) readonly _employeeMapper: IEntityMapper<Employee, EmployeeEntity>,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepo: IUserRepository,
        @inject(Identifier.LOGGER) readonly _logger: any
    ) {
        super(_employeeModel, _employeeMapper, _logger)
    }

    public async create(item: Employee): Promise<Employee | undefined> {
        if (item.password) item.password = this._userRepo.encryptPassword(item.password)
        return super.create(item)
    }

    public async checkExists(Employee: Employee): Promise<boolean> {
        const query: Query = new Query().fromJSON({ filters: { _id: { $ne: Employee.id } } })
        // const check_cpf = (process.env.CHECK_CPF === 'true') ? true : Default.CHECK_CPF

        if (Employee.email) {
            const user_email = Employee.email.toLowerCase()
            query.addFilter({ email: user_email })
        } else if (Employee.email) {
            const user_email = Employee.email.toLowerCase()
            query.addFilter({ email: user_email })
        }

        // if (Employee.cnpj && Employee.email) {
        //     const user_email = Employee.email.toLowerCase()
        //     query.addFilter({ $or: [{ cpf: Employee.cnpj }, { email: user_email }] })
        // } else if (Employee.cnpj) {
        //     query.addFilter({ cnpj: Employee.cnpj })
        // } else if (Employee.email) {
        //     const user_email = Employee.email.toLowerCase()
        //     query.addFilter({ email: user_email })
        // }

        // if (check_cpf && Employee.cpf) {
        //     const result = await this._userRepo.checkCpf(Employee.cpf)
        //     if (!result) Promise.reject(result)
        // }

        return new Promise<boolean>((resolve, reject) => {
            super.find(query)
                .then((result: Array<Employee> | undefined) => {
                    if (!result?.length) resolve(!result)
                    if (result && result.length > 0) resolve(!!result)
                    else if (result && result[0].email === Employee.email) resolve(!!result)
                    resolve(!result)
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    public update(item: Employee): Promise<Employee | undefined> {
        const itemUp: any = this.mapper.transform(item)
        let set: any = { $set: itemUp }

        if (itemUp.cpf) {
            set = {
                $set: { ...itemUp, __enc_cpf: false },
                $unset: { cnpj: '' }
            }
        }

        if (itemUp.cnpj) {
            set = {
                $set: { ...itemUp, __enc_cnpj: false },
                $unset: { cpf: '' }
            }
        }

        return new Promise<Employee | undefined>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: itemUp.id, type: UserType.EMPLOYEE }, set, { new: true })
                .exec()
                .then((result: EmployeeEntity) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }
}

