import { UuidType } from '../../common/types';
import { GeneralEventDod } from '../../domain/domain-data/domain-types';
import { GeneralARDParams } from '../../domain/domain-data/params-types';
import { GetARParamsEvents } from '../../domain/domain-data/type-functions';
import { DeliveryEventType } from '../bus/types';
import { EventDeliverer } from '../event-deliverer/event-deliverer';
import { GeneralModuleResolver } from '../module/types';

export interface EventRepository {
  init(resovler: GeneralModuleResolver): void

  addEvent(event: GeneralEventDod, aRootId: UuidType): Promise<void>

  getEvent<E extends GeneralEventDod>(id: UuidType): Promise<E | undefined>

  getAggregateEvents<A extends GeneralARDParams>(aRootId: UuidType): Promise<GetARParamsEvents<A>[]>

  isEventExist(id: UuidType): Promise<boolean>

  getNotPublishedEvents(): Promise<DeliveryEventType[]>

  markAsPublished(id: UuidType): Promise<void>

  subscribe(eventDeliverer: EventDeliverer): void
}
