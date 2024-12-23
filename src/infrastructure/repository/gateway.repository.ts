import { injectable } from 'inversify'
import { IGatewayRepository } from 'application/port/gateway.repository.interface'
import { readFileSync } from 'fs'

/**
 * Implementation of the Gateway repository.
 * 
 * @implements {IGatewayRepository}
 */
@injectable()
export class GatewayRepository implements IGatewayRepository {

    public async getConsumer(email: string): Promise<object> {
        try {
            const consumersUrl = process.env.INTERNAL_GATEWAY_HOSTNAME + `/consumers/` + `${email}`

            const response = await fetch(consumersUrl, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (response.status === 200) {
                return Promise.resolve(await response.json())
            } else {
                return Promise.resolve({})
            }
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async createConsumer(email: string, userId: string): Promise<string> {
        try {
            const consumersUrl = process.env.INTERNAL_GATEWAY_HOSTNAME + `/consumers`
            const data = {
                'username': email,
                'custom_id': userId
            }

            const response = await fetch(consumersUrl, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            return Promise.resolve(response.json())
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async addConsumerToGroup(consumerId: string, groupConsumer: string): Promise<string> {
        try {
            const url = process.env.INTERNAL_GATEWAY_HOSTNAME + `/consumers/` + `${consumerId}` + '/acls'
            const data = {
                'group': groupConsumer
            }

            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            return Promise.resolve(response.json())
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async addConsumerToken(consumerId: string, userId: string): Promise<string> {
        try {
            const url = process.env.INTERNAL_GATEWAY_HOSTNAME + `/consumers/` + `${consumerId}` + '/jwt'
            const public_key = readFileSync(`${process.env.JWT_PUBLIC_KEY_PATH}`, 'utf-8')
            const data = {
                'key': userId, 'rsa_public_key': public_key, 'algorithm': 'RS256'
            }

            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            return Promise.resolve(response.json())
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async deleteConsumer(email: string): Promise<void> {
        try {
            const url = process.env.INTERNAL_GATEWAY_HOSTNAME + `/consumers/` + `${email}`
            const response = await fetch(url, {
                method: 'DELETE',
            })

            return Promise.resolve(response.json())
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
