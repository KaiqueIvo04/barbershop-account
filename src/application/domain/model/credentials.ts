import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class Credentials implements IJSONSerializable, IJSONDeserializable<Credentials> {
    private _email?: string
    private _password?: string

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

    public fromJSON(json: any): Credentials {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.email !== undefined) this.email = json.email
        if (json.password !== undefined) this.password = json.password

        return this
    }

    public toJSON(): any {
        return {
            email: this.email,
            password: this.password,
        }
    }
}
