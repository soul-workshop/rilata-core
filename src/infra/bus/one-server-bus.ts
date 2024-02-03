import { Bus } from '../../app/bus/bus';
import { BusEventSubscribe, EventHandler, BusEventPublish } from '../../app/bus/types';

export class OneServerBus implements Bus {
  protected handlers: Record<string, EventHandler> = {};

  constructor() {}

  async subscribe(eventSubscribe: BusEventSubscribe, cb: EventHandler): Promise<void> {
    this.handlers[this.getKey(eventSubscribe)] = cb;
  }

  async publish(eventPublish: BusEventPublish): Promise<void> {
    const cb = this.handlers[this.getKey(eventPublish)];
    if (cb === undefined) return;
    cb(JSON.parse(eventPublish.event));
  }

  protected getKey(event: BusEventSubscribe): string {
    return `${event.moduleName}___${event.eventName}`;
  }
}
