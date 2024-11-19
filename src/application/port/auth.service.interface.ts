import { Credentials } from "application/domain/model/credentials"

/**
 * Auth service interface.
 */
export interface IAuthService {
    authenticate(credentials: Credentials): Promise<object>

    /**
     * Searches for a user by email and updates it with a token that has priority to reset their password.
     *
     * @param email
     * @return {Promise<object>} Feedback message about the forgot password flow.
     * @throws {ValidationException | RepositoryException}
     */
    forgotPassword(email: string): Promise<object>

    /**
     * Change's the user's password.
     * There are two scenarios available:
     *
     * SCENARIO 01 - User remembers his current password.
     *
     * The operation is accessed through a normal access token.
     * And the following parameters are used: email, old_password and new_password.
     *
     * SCENARIO 02 - User does not remember his current password.
     *
     * The operation is accessed through a access token with priority to reset the password,
     * a token obtained through the forgotPassword method.
     * And only the following parameters are used: email and new_password.
     *
     * @param email
     * @param oldPassword
     * @param newPassword
     * @param token
     * @return {Promise<boolean>} True if the password has been updated and false otherwise.
     * @throws {ValidationException | RepositoryException}
     */
    changePassword(email: string, oldPassword: string, newPassword: string, token: string): Promise<boolean>
}