import { GeneralEventDod } from '../../domain/domain-data/domain-types';

export type BusEventSubscribe = {
  moduleName: string,
  eventName: string,
}

export type BusEventPublish = BusEventSubscribe & {
  event: string,
}

export type EventHandler = (event: GeneralEventDod) => Promise<void>
