import { UsersScopes } from "../utils/user.scopes";
import { UserType } from "../utils/user.types";
import { JsonUtils } from "../utils/json.utils";
import { User } from "./user";

export class Employee extends User {
    private _role?: string | undefined;
    private _status?: boolean | undefined;
    private _responsible_admin?: string | undefined;

    public get role(): string | undefined {
        return this._role;
    }

    public set role(value: string | undefined) {
        this._role = value;
    }

    public get status(): boolean | undefined {
        return this._status;
    }

    public set status(value: boolean | undefined) {
        this._status = value;
    }

    public get responsible_admin(): string | undefined {
        return this._responsible_admin;
    }

    public set responsible_admin(value: string | undefined) {
        this._responsible_admin = value;
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
        if (json.status !== undefined) this.status = json.status
        if (json.responsible_admin !== undefined) this.responsible_admin = json.responsible_admin

        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            role: this.role,
            status: this.status,
            responsible_admin: this.responsible_admin
        }
    }
}