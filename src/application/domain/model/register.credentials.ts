import { LoginCredentials } from './login.credentials'

export class RegisterCredentials extends LoginCredentials {
    private _name?: string
    private _confirm_password?: string | undefined

    public get name(): string | undefined {
        return this._name
    }

    public set name(value: string | undefined) {
        this._name = value
    }

    public get confirm_password(): string | undefined {
        return this._confirm_password
    }

    public set confirm_password(value: string | undefined) {
        this._confirm_password = value
    }

    public override fromJSON(json: any): RegisterCredentials {
        super.fromJSON(json)
        if (json.name !== undefined) this.name = json.name
        if (json.confirm_password !== undefined) this._confirm_password = json.confirm_password
        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            name: this.name,
            confirm_password: this.confirm_password
        }
    }
}
