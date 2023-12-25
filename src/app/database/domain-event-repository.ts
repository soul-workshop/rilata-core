import { UuidType } from '../../common/types';
import { GeneralEventDod } from '../../domain/domain-object-data/common-types';

export interface DomainEventRepository {
  addEvent(event: GeneralEventDod): Promise<void>

  getNotPublishedEvents(): GeneralEventDod[]

  markAsPublished(eventId: UuidType): Promise<void>
}
