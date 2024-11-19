import { IRepository } from './repository.interface'
import { Client } from 'application/domain/model/client'
/**
 * Interface of the Client repository.
 * Must be implemented by the Client repository at the infrastructure layer.
 *
 * @extends {IRepository<Client>}
 */

export interface IClientRepository extends IRepository<Client> {
}
