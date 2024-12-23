import { Entity } from './entity'
import { JsonUtils } from '../utils/json.utils'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'

/**
 * Implementation of the user entity.
 *
 * @extends {Entity}
 * @implements {IJSONSerializable, IJSONDeserializable<User>}
 */
export class User extends Entity implements IJSONSerializable, IJSONDeserializable<User> {
    private _name?: string  // User name.
    private _contact_personal?: string  // User contact_personal.
    private _email?: string  // User email.
    private _password?: string  // Password for User authentication.
    private _last_login?: Date  // Date of the last login of the User on the platform in UTC, according to the ISO 8601 format.
    private _type?: string  // Type of user. Can be Admin, Manager, Requester, Regulator or Operator.
    private _scopes!: Array<string>  // Scope that defines the types of access the user has.
    private _protected?: boolean  // To block (or not) remove an Admin user.
    private _password_reset_token?: string  // Temporary token of password reset.
    private _active?: boolean  // Flag that indicates if the user is active or not

    constructor() {
        super()
    }

    get name(): string | undefined {
        return this._name
    }

    set name(value: string | undefined) {
        this._name = value
    }

    get contact_personal(): string | undefined {
        return this._contact_personal
    }

    set contact_personal(value: string | undefined) {
        this._contact_personal = value
    }

    get email(): string | undefined {
        return this._email
    }

    set email(value: string | undefined) {
        this._email = value
    }

    get password(): string | undefined {
        return this._password
    }

    set password(value: string | undefined) {
        this._password = value
    }

    get last_login(): Date | undefined {
        return this._last_login
    }

    set last_login(value: Date | undefined) {
        this._last_login = value
    }

    get type(): string | undefined {
        return this._type
    }

    set type(value: string | undefined) {
        this._type = value
    }

    get scopes(): Array<string> {
        return this._scopes
    }

    set scopes(value: Array<string>) {
        this._scopes = value
    }

    get protected(): boolean | undefined {
        return this._protected
    }

    set protected(value: boolean | undefined) {
        this._protected = value
    }

    get password_reset_token(): string | undefined {
        return this._password_reset_token
    }

    set password_reset_token(value: string | undefined) {
        this._password_reset_token = value
    }

    get active(): boolean | undefined {
        return this._active
    }

    set active(value: boolean | undefined) {
        this._active = value
    }

    public fromJSON(json: any): User {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id) super.id = json.id
        if (json.name !== undefined) this.name = json.name
        if (json.contact_personal !== undefined) this.contact_personal = json.contact_personal
        if (json.email !== undefined) this.email = json.email
        if (json.password !== undefined) this.password = json.password

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            created_at: super.created_at,
            updated_at: super.updated_at,
            name: this.name,
            contact_personal: this.contact_personal,
            email: this.email,
            active: this.active,
            type: this.type,
            last_login: this.last_login
        }
    }
}
