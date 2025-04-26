import { UsersScopes } from '../utils/user.scopes'
import { UserType } from '../utils/user.types'
import { JsonUtils } from '../utils/json.utils'
import { User } from './user'

export class Employee extends User {
    private _role?: string | undefined
    private _avaliable?: boolean | undefined
    private _responsible_admin_id?: string | undefined

    public get role(): string | undefined {
        return this._role
    }

    public set role(value: string | undefined) {
        this._role = value
    }

    public get avaliable(): boolean | undefined {
        return this._avaliable
    }

    public set avaliable(value: boolean | undefined) {
        this._avaliable = value
    }

    public get responsible_admin_id(): string | undefined {
        return this._responsible_admin_id
    }

    public set responsible_admin_id(value: string | undefined) {
        this._responsible_admin_id = value
    }
    constructor() {
        super()
        super.type = UserType.EMPLOYEE
        super.scopes = UsersScopes.EMPLOYEE
    }

    public fromJSON(json: any): Employee {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id) super.id = json.id
        if (json.name !== undefined) this.name = json.name
        if (json.contact_personal !== undefined) this.contact_personal = json.contact_personal
        if (json.email !== undefined) this.email = json.email
        if (json.password !== undefined) this.password = json.password
        if (json.role !== undefined) this.role = json.role
        if (json.avaliable !== undefined) this.avaliable = json.avaliable
        if (json.responsible_admin_id !== undefined) this.responsible_admin_id = json.responsible_admin_id

        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            role: this.role,
            avaliable: this.avaliable,
            responsible_admin: this.responsible_admin_id
        }
    }
}
