import { Entity } from "./entity";
import { JsonUtils } from '../utils/json.utils'
import { IJSONDeserializable } from "../utils/json.deserializable.interface";
import { IJSONSerializable } from "../utils/json.serializable.interface";

export class User extends Entity implements IJSONDeserializable<User>, IJSONSerializable {
    private _name?: string;
    private _password?: string;
    private _email?: string;
    private _contact_personal?: string;
    private _type?: string; //Type of user
    private _scopes!: Array<string>;  // Scope that defines the types of access the user has.
    private _last_login?: Date;  // Date of the last login of the User on the platform in UTC, according to the ISO 8601 format.

    constructor() {
        super()
    }

    public get name(): string | undefined {
        return this._name;
    }

    public set name(value: string | undefined) {
        this._name = value;
    }

    public get password(): string | undefined {
        return this._password;
    }

    public set password(value: string | undefined) {
        this._password = value;
    }

    public get email(): string | undefined {
        return this._email;
    }

    public set email(value: string | undefined) {
        this._email = value;
    }

    public get contact_personal(): string | undefined {
        return this._contact_personal;
    }

    public set contact_personal(value: string) {
        this._contact_personal = value;
    }

    public get type(): string | undefined {
        return this._type;
    }

    public set type(value: string | undefined) {
        this._type = value;
    }
    
    public get scopes(): Array<string> {
        return this._scopes;
    }

    public set scopes(value: Array<string>) {
        this._scopes = value;
    }

    public get last_login(): Date | undefined {
        return this._last_login;
    }

    public set last_login(value: Date | undefined) {
        this._last_login = value;
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
            contact_personal: this._contact_personal,
            email: this.email,
            type: this.type,
            last_login: this.last_login
        }
    }
}