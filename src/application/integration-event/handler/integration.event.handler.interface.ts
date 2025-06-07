import { IntegrationEvent } from '../event/integration.event'
import { IJSONSerializable } from '../../domain/utils/json.serializable.interface'
export interface IIntegrationEventHandler<T> extends IntegrationEvent<IJSONSerializable>{
    handle(event: T): void
}
