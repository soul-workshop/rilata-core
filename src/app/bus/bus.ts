import { ServerResolver } from '../server/server-resolver';
import { EventHandler, PublishedEvent, SubscribeToEvent } from './types';

export interface Bus {
  subscribe(eventSubscribe: SubscribeToEvent, cb: EventHandler): Promise<void>

  publish(eventPublish: PublishedEvent): Promise<void>

  init(resolver: ServerResolver): Promise<void>

  stop(): void
}
