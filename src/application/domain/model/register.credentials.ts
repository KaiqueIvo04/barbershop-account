import { LoginCredentials } from './login.credentials'

export class RegisterCredentials extends LoginCredentials {
    private _name?: string

    public get name(): string | undefined {
        return this._name
    }
    public set name(value: string | undefined) {
        this._name = value
    }

    public override fromJSON(json: any): RegisterCredentials {
        super.fromJSON(json)
        if (json.name !== undefined) this.name = json.name
        return this
    }

    public override toJSON(): any {
        return {
          ...super.toJSON(),
          name: this.name,
        }
    }
}
