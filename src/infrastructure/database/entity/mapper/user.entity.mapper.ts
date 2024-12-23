import { injectable } from 'inversify'
import { User } from 'application/domain/model/user'
import { UserEntity } from '../user.entity'
import { IEntityMapper } from 'infrastructure/port/entity.mapper.interface'

@injectable()
export class UserEntityMapper implements IEntityMapper<User, UserEntity> {
    public transform(item: any): any {
        if (item instanceof User) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    /**
     * Convert {User} for {UserEntity}.
     *
     * @see Before setting the value, it is important to verify that the type is valid.
     * Therefore, you do not run the risk that in an UPDATE / PATCH action type,
     * attributes that should not be updated are saved with null values.
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown.
     * @param item
     */
    public modelToModelEntity(item: User): UserEntity {
        const result: UserEntity = new UserEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.name !== undefined) result.name = item.name
        if (item.contact_personal !== undefined) result.contact_personal = item.contact_personal
        if (item.email !== undefined) result.email = item.email.toLowerCase()
        if (item.password !== undefined) result.password = item.password
        if (item.last_login !== undefined) result.last_login = item.last_login
        if (item.type !== undefined) result.type = item.type
        if (item.protected !== undefined) result.protected = item.protected
        if (item.active !== undefined) result.active = item.active
        if (item.password_reset_token !== undefined) result.password_reset_token = item.password_reset_token

        return result
    }

    /**
     * Convert JSON for {User}.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param json
     */
    public jsonToModel(json: any): User {
        const result: User = new User()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.created_at !== undefined) result.created_at = json.created_at
        if (json.updated_at !== undefined) result.updated_at = json.updated_at
        if (json.name !== undefined) result.name = json.name
        if (json.contact_personal !== undefined) result.contact_personal = json.contact_personal
        if (json.email !== undefined) result.email = json.email.toLowerCase()
        if (json.password !== undefined) result.password = json.password
        if (json.last_login !== undefined) result.last_login = json.last_login
        if (json.type !== undefined) result.type = json.type
        if (json.protected !== undefined) result.protected = json.protected
        if (json.active !== undefined) result.active = json.active
        if (json.password_reset_token !== undefined) result.password_reset_token = json.password_reset_token

        return result
    }
}
