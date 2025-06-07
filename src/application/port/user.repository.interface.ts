import { IRepository } from './repository.interface'
import { User } from '../../application/domain/model/user'

/**
 * Interface of the User repository.
 * Must be implemented by the User repository at the infrastructure layer.
 *
 * @extends {IRepository<User>}
 */
export interface IUserRepository extends IRepository<User> {
    findByIdAndType(userId: string, userType: string): Promise<User | undefined>

    findById(userId: string): Promise<User | undefined>


    /**
     * Checks if an user already has a registration.
     * The unique attributes are cpf and email.
     *
     * @param user Data of the User to be searched.
     * @return {Promise<boolean>} True if it exists or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     */
    checkExists(user: User): Promise<boolean>

    updateLastLogin(email: string): Promise<boolean>

    /**
     * Changes the user's password.
     *
     * @param userEmail
     * @param oldPassword
     * @param newPassword
     * @return {Promise<User | undefined>}
     * @throws {ValidationException | RepositoryException}
     */
    // changePassword(userEmail: string, oldPassword: string, newPassword: string): Promise<User | undefined>

    /**
     * Resets the user's password.
     *
     * @param userId
     * @param userEmail
     * @param newPassword
     * @param token
     * @return {Promise<User | undefined>}
     * @throws {ValidationException | RepositoryException}
     */
    // resetPassword(userId: string, userEmail: string, newPassword: string, token: string): Promise<User | undefined>

    /**
     * Resets the user's password.
     *
     * @param userId
     * @param newPassword
     * @return {Promise<User | undefined>}
     * @throws {NotFoundException | RepositoryException}
     */
    // resetUserPassword(userId: string, newPassword: string): Promise<User | undefined>

    /**
     * Encrypts the user's password.
     *
     * @param password
     * @return {string} Encrypted password if the encrypt was successfully.
     */
    encryptPassword(password: string): string

    /**
     * Compares if two passwords match.
     *
     * @param passwordOne The not hash password.
     * @param passwordTwo The hash password.
     * @return True if the passwords matches, false otherwise.
     */
    comparePasswords(passwordOne: string, passwordTwo: string): boolean

    /**
     * 
     * @param cpf CPF that will be verified
     * @return Returns the user's name, if it is registered in the system
     */
    // checkCpf(cpf: string): Promise<undefined>
}
