// import { User } from '../../application/domain/model/user'
import { LoginCredentials } from '../domain/model/login.credentials'

/**
 * Interface of the auth repository.
 * Must be implemented by the auth repository at the infrastructure layer.
 */
export interface IAuthRepository {
    authenticate(credentials: LoginCredentials): Promise<object>

    /**
     * Searches for a user by email and updates it with a token that has priority to reset their password.
     *
     * @param email
     * @return {Promise<User | undefined>}
     * @throws {ValidationException | RepositoryException}
     */
    // forgotPassword(email: string): Promise<User | undefined>

    validateToken(token: string): Promise<boolean>

    // getTokenPayload(token: string): Promise<any>
}
