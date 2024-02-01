import { UuidType } from '../../common/types';
import { GeneralEventDod } from '../../domain/domain-data/domain-types';
import { DomainEventSubscriber } from './domain-event-subscriber';
import { EventAsJson } from './types';

export interface DomainEventRepository extends DomainEventSubscriber {
  addEvent(event: GeneralEventDod): Promise<void>

  getNotPublishedEvents(): EventAsJson[]

  markAsPublished(eventId: UuidType): Promise<void>
}
