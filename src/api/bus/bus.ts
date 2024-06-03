import { GeneralServerResolver } from '../server/types';
import { PublishBusMessage, SubcribeToBusMessage } from './types';

export interface Bus {
  subscribe(eventSubscribe: SubcribeToBusMessage): Promise<void>

  publish(eventPublish: PublishBusMessage): Promise<void>

  init(resolver: GeneralServerResolver): Promise<void>

  stop(): void
}
