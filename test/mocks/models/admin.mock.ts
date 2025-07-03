import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultFunctions } from '../utils/default.functions'

export class AdminMock {
    public static generate(): Admin {
        const admin: Admin = new Admin()
        admin.id = DefaultFunctions.generateObjectId()
        admin.name = 'Admin mock'
        admin.contact_personal = '(83) 98888-8851'
        admin.email = 'admin@mock.com'
        admin.password = '123456'
        admin.type = 'admin'
        admin.last_login = new Date()
        admin.protected = false
        
        return admin
    }
}
