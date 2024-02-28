/* eslint-disable @typescript-eslint/no-empty-function */
import { Bus } from '../../app/bus/bus';
import { SubscribeToEvent, EventHandler, PublishedEvent } from '../../app/bus/types';
import { ServerResolver } from '../../app/server/server-resolver';

export class OneServerBus implements Bus {
  protected handlers: Record<string, EventHandler> = {};

  async init(resolver: ServerResolver): Promise<void> {}

  stop(): void {}

  async subscribe(eventSubscribe: SubscribeToEvent, cb: EventHandler): Promise<void> {
    this.handlers[this.getKey(eventSubscribe)] = cb;
  }

  async publish(eventPublish: PublishedEvent): Promise<void> {
    const cb = this.handlers[this.getKey(eventPublish)];
    if (cb === undefined) return;
    cb(JSON.parse(eventPublish.event));
  }

  protected getKey(event: SubscribeToEvent): string {
    return `${event.moduleName}___${event.eventName}`;
  }
}
