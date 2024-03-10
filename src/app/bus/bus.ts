import { ServerResolver } from '../server/server-resolver';
import { PublishBusMessage, SubcribeToBusMessage } from './types';

export interface Bus {
  subscribe(eventSubscribe: SubcribeToBusMessage): Promise<void>

  publish(eventPublish: PublishBusMessage): Promise<void>

  init(resolver: ServerResolver): Promise<void>

  stop(): void
}
