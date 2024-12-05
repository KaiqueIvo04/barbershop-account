import { IRepository } from './repository.interface'
import { IntegrationEvent } from '../integration-event/event/integration.event'
import { IJSONSerializable } from '../../application/domain/utils/json.serializable.interface'

/**
 * Interface of the integration event repository.
 * Must be implemented by the integration event repository at the infrastructure layer.
 *
 * @see {@link IntegrationEventRepository} for further information.
 * @extends {IRepository<IntegrationEvent<IJSONSerializable>>}
 */
export interface IIntegrationEventRepository extends IRepository<IntegrationEvent<IJSONSerializable>> {
    publishEvent(event: IntegrationEvent<IJSONSerializable>): void
}
