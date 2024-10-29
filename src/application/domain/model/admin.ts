import { UsersScopes } from "../utils/user.scopes";
import { UserType } from "../utils/user.types";
import { JsonUtils } from "../utils/json.utils";
import { User } from "./user";

export class Admin extends User {
    constructor() {
        super()
        super.type = UserType.ADMIN
        super.scopes = UsersScopes.ADMIN
    }

    public fromJSON(json: any): Admin {
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
            ...super.toJSON(),
        }
    }
}