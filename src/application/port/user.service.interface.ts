import { IService } from './service.interface'
import { User } from '../domain/model/user'

/**
 * User service interface.
 *
 * @extends {IService<User>}
 */
export interface IUserService extends IService<User> {
    checkCpf(cpf: string): Promise<string | undefined>
    resetPassword(id: string, password: string): Promise<User | undefined>
    updateActive(id: string, active: boolean): Promise<User | undefined>
}