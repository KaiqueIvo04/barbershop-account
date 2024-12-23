import { UserEntity } from './user.entity'

export class EmployeeEntity extends UserEntity {
    public role?: string
    public avaliable?: boolean
    public responsible_admin_id?: string
}
