import { UuidType } from '../../common/types';
import { GeneralEventDod } from '../../domain/domain-data/domain-types';

export interface DomainEventRepository {
  addEvent(event: GeneralEventDod): Promise<void>

  isEventExist(actionId: UuidType): Promise<boolean>

  getNotPublishedEvents(): Promise<string[]>

  markAsPublished(actionId: UuidType): Promise<void>
}
