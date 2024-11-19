import { Entity } from './entity'

export class UserEntity extends Entity {
    public name?: string
    public contact_personal?: string
    public email?: string
    public password?: string
    public last_login?: Date
    public type?: string
    public protected?: boolean
    public password_reset_token?: string
    public active?: boolean
    public is_authorized?: boolean
}