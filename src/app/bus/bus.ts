import { EventHandler, BusEventPublish, BusEventSubscribe } from './types';

export interface Bus {
  subscribe(eventSubscribe: BusEventSubscribe, cb: EventHandler): Promise<void>

  publish(eventPublish: BusEventPublish): Promise<void>
}
