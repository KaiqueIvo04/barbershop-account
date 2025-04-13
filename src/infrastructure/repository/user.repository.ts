import bcrypt from 'bcryptjs'
import { IUserRepository } from 'application/port/user.repository.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { Query } from './query/query'
import { IQuery } from 'application/port/query.interface'
// import { Default } from 'utils/default'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { User } from 'application/domain/model/user'
import { UserEntity } from 'infrastructure/entity/user.entity'
import { BaseRepository } from './base/base.repository'

@injectable()
export class UserRepository extends BaseRepository<User, UserEntity> implements IUserRepository {
    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _userModel: any,
        @inject(Identifier.USER_ENTITY_MAPPER) readonly _userMapper: IEntityMapper<User, UserEntity>,
        @inject(Identifier.LOGGER) readonly _logger: any
    ) {
        super(_userModel, _userMapper, _logger)
    }

    public findById(userId: string): Promise<User | undefined> {
        return super.findOne(new Query().fromJSON({ filters: { _id: userId } }))
    }

    public findByIdAndType(userId: string, userType: string): Promise<User | undefined> {
        const query: IQuery = new Query()
        query.addFilter({ _id: userId, type: userType })

        return super.findOne(query)
    }

     /*
     * Checks if an user already has a registration.
     * The unique attributes are cpf and email.
     *
     * @param user Data of the User to be searched.
     * @return {Promise<boolean>} True if it exists or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     */
     public async checkExists(user: User): Promise<boolean> {
        const query: Query = new Query().fromJSON({ filters: { _id: { $ne: user.id } } })
        // const check_cpf = (process.env.CHECK_CPF === 'true') ? true : Default.CHECK_CPF

        if (user.email) {
            // Formatted user email to lower case
            const user_email = user.email.toLowerCase()
            query.addFilter({ email: user_email })
        }else if (user.email) {
            // Formatted user email to lower case
            const user_email = user.email.toLowerCase()
            query.addFilter({ email: user_email })
        }

        // Validate CPF, validation will only occur if the execution environment is the production environment.
        // if (check_cpf && user.cpf) {
        //     const result = await this.checkCpf(user.cpf)
        //     if (!result) Promise.reject(result)
        // }

        return new Promise<boolean>((resolve, reject) => {
            super.find(query)
                .then((result: Array<User> | undefined) => {
                    if (!result?.length) resolve(!result)
                    if (result && result.length > 0) resolve(!!result)
                    if (result && result[0].type !== 'patient') resolve(!!result)
                    else if (result && result[0].email === user.email) resolve(!!result)
                    resolve(!result)
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    public updateLastLogin(email: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._userModel
                .findOneAndUpdate({ email }, { last_login: new Date().toISOString() })
                .then(result => resolve(!!result))
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

     /*
     * Changes the user's password.
     *
     * @param userEmail
     * @param oldPassword
     * @param newPassword
     * @return {Promise<User | undefined>}
     * @throws {ValidationException | RepositoryException}
     */
    //  public changePassword(userEmail: string, oldPassword: string, newPassword: string): Promise<User | undefined> {
    //     return new Promise<User | undefined>((resolve, reject) => {
    //         this._userModel.findOne({ email: userEmail })
    //             .then((user: UserEntity) => {
    //                 if (!user) return resolve(undefined)
    //                 if (!this.comparePasswords(oldPassword, user.password)) {
    //                     return reject(new ChangePasswordException(
    //                         Strings.USER.PASSWORD_NOT_MATCH,
    //                         Strings.USER.PASSWORD_NOT_MATCH_DESCRIPTION
    //                     ))
    //                 }
    //                 newPassword = this.encryptPassword(newPassword)
    //                 this._userModel.findOneAndUpdate({ email: userEmail }, { password: newPassword }, { new: true })
    //                     .then(result => {
    //                         if (!result) return resolve(undefined)
    //                         return resolve(this._userMapper.transform(result))
    //                     })
    //                     .catch(err => reject(super.mongoDBErrorListener(err)))
    //             })
    //             .catch(err => reject(super.mongoDBErrorListener(err)))
    //     })
    // }

    // /**
    //  * Resets the user's password.
    //  *
    //  * @param userId
    //  * @param userEmail
    //  * @param newPassword
    //  * @param token
    //  * @return {Promise<User | undefined>}
    //  * @throws {ValidationException | RepositoryException}
    //  */
    // public async resetPassword(userId: string, userEmail: string, newPassword: string, token: string):
    //     Promise<User | undefined> {
    //     return new Promise<User | undefined>((resolve, reject) => {
    //         newPassword = this.encryptPassword(newPassword)
    //         this._userModel.findOneAndUpdate(
    //             { _id: userId, email: userEmail, password_reset_token: token },
    //             { password: newPassword, $unset: { password_reset_token: 1 } })
    //             .then(result => {
    //                 if (!result) {
    //                     return reject(new AuthenticationException(Strings.ERROR_MESSAGE.INVALID_PASSWORD_RESET_TOKEN,
    //                         Strings.ERROR_MESSAGE.INVALID_PASSWORD_RESET_TOKEN_DESC))
    //                 }
    //                 return resolve(this._userMapper.transform(result))
    //             })
    //             .catch(() => reject(new RepositoryException(Strings.ERROR_MESSAGE.UNEXPECTED)))
    //     })
    // }

    /**
     * Resets the user's password.
     *
     * @param userId
     * @param newPassword
     * @param token
     * @return {Promise<User | undefined>}
     * @throws {NotFoundException | RepositoryException}
     */
    // public async resetUserPassword(userId: string, newPassword: string):
    //     Promise<User | undefined> {
    //     return new Promise<User | undefined>((resolve, reject) => {
    //         newPassword = this.encryptPassword(newPassword)
    //         this._userModel.findOneAndUpdate({ _id: userId }, { password: newPassword })
    //             .then(result => {
    //                 if (!result) {
    //                     return reject(new NotFoundException(Strings.USER.NOT_FOUND, Strings.USER.NOT_FOUND_DESCRIPTION))
    //                 }
    //                 return resolve(this._userMapper.transform(result))
    //             })
    //             .catch(() => reject(new RepositoryException(Strings.ERROR_MESSAGE.UNEXPECTED)))
    //     })
    // }

    /**
     * Encrypts the user's password.
     *
     * @param password
     * @return {string} Encrypted password if the encrypt was successfully.
     */
    public encryptPassword(password: string | undefined): string {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    /**
     * Compares if two passwords match.
     *
     * @param passwordOne The not hash password.
     * @param passwordTwo The hash password.
     * @return True if the passwords matches, false otherwise.
     */
    public comparePasswords(passwordOne: string, passwordTwo: string | undefined): boolean {
        return bcrypt.compareSync(passwordOne, passwordTwo)
    }

    /**
     * 
     * @param cpf CPF that will be verified
     * @return Returns the user's name, if it is registered in the system
     */
    // public async checkCpf(cpf: string): Promise<undefined> {
    //     // 1. Check CPF
    //     return new Promise<undefined>((resolve, reject) => {
    //         axios.get(`${Default.CHECK_CPF_URL}?cpf=${cpf}&cpfUsuario=${cpf}`, {
    //             headers: {
    //                 'Isis-Token': `${process.env.ISIS_TOKEN}`
    //             }
    //         }).then((response) => {
    //             if (response.data.result.qtdeRegistrosRetornados) {
    //                 const result = response.data.result.resultado[0].nome_pessoa_fisica
    //                 return resolve(result)
    //             }
    //         }).catch(() => reject(new NotFoundException(Strings.USER.CPF_NOT_FOUND, Strings.USER.CPF_NOT_FOUND_DESCRIPTION)))
    //     })
    // }
}
