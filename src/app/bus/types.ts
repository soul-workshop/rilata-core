import { UuidType } from '../../common/types';
import { GeneralEventDod } from '../../domain/domain-data/domain-types';
import { EventAsJson } from '../database/types';

export type SubscribeToEvent = {
  moduleName: string,
  eventName: string,
}

export type PublishedEvent = SubscribeToEvent & {
  event: EventAsJson,
  aRootId: UuidType,
}

export type DeliveryEventType = {
  requestId: UuidType,
  event: EventAsJson,
  eventName: string,
  aRootId: UuidType,
}

export type EventHandler = (event: GeneralEventDod) => Promise<void>
