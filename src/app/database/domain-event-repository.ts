import { UuidType } from '../../common/types';
import { GeneralEventDod } from '../../domain/domain-data/domain-types';
import { DeliveryEvent } from '../bus/types';
import { DomainEventSubscriber } from './domain-event-subscriber';

export interface DomainEventRepository extends DomainEventSubscriber {
  addEvent(event: GeneralEventDod): Promise<void>

  isEventExist(actionId: UuidType): Promise<boolean>

  getNotPublishedEvents(): DeliveryEvent[]

  markAsPublished(actionId: UuidType): Promise<void>
}
