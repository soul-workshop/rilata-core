import { EventAsJson, EventAsJsonHandler } from './types';

export interface DomainEventSubscriber {
  subscribe(cb: EventAsJsonHandler): EventAsJson
}
