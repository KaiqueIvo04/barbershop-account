import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class Email implements IJSONSerializable, IJSONDeserializable<Email> {
    private _to?: any
    private _action_url?: string
    private _password?: string

    get to(): any {
        return this._to
    }

    set to(value: any) {
        this._to = value
    }

    get action_url(): string | undefined {
        return this._action_url
    }

    set action_url(value: string | undefined) {
        this._action_url = value
    }

    get password(): string | undefined {
        return this._password
    }

    set password(value: string | undefined) {
        this._password = value
    }

    public fromJSON(json: any): Email {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.to) this.to = json.to
        if (json.action_url) this.action_url = json.action_url
        if (json.password) this.password = json.password

        return this
    }

    public toJSON(): any {
        return {
            to: this.to,
            action_url: this.action_url,
            password: this.password
        }
    }
}