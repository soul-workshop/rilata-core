import { UuidType } from '../../common/types';
import { GeneralEventDod } from '../../domain/domain-data/domain-types';
import { DomainEventSubscriber } from './domain-event-subscriber';
import { EventAsJson } from './types';

export interface DomainEventRepository extends DomainEventSubscriber {
  addEvent(event: GeneralEventDod): Promise<void>

  isEventExist(actionId: UuidType): Promise<boolean>

  getNotPublishedEvents(): EventAsJson[]

  markAsPublished(actionId: UuidType): Promise<void>
}
