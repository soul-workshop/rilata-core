import { EventAsJson, EventAsJsonHandler } from './types';

export interface DomainEventSubscriber {
  subscribe(eventName: string, cb: EventAsJsonHandler): EventAsJson
}
