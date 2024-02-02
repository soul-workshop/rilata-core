import { GeneralEventDod } from '../../domain/domain-data/domain-types';
import { EventAsJson } from '../database/types';

export type BusEventSubscribe = {
  moduleName: string,
  eventName: string,
}

export type BusEventPublish = BusEventSubscribe & {
  event: EventAsJson,
}

export type EventHandler = (event: GeneralEventDod) => Promise<void>
