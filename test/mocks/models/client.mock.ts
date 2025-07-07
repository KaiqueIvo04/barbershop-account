import { Client } from '../../../src/application/domain/model/client'
import { DefaultFunctions } from '../utils/default.functions'

export class ClientMock {
    public static generate(): Client {
        const client: Client = new Client()
        client.id = DefaultFunctions.generateObjectId()
        client.name = 'Client mock'
        client.contact_personal = '(83) 98988-8888'
        client.email = 'client@mock.com'
        client.password = '123456'
        client.type = 'client'
        client.last_login = new Date()
        client.protected = false
        return client
    }
}