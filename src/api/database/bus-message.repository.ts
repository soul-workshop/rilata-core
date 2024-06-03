import { UuidType } from '../../core/types';
import { DelivererToBus } from '../bus/deliverer-to-bus';
import { DeliveryBusMessage } from '../bus/types';
import { GeneralModuleResolver } from '../module/types';
import { Repositoriable } from '../resolve/repositoriable';
import { Asyncable } from './types';

export interface BusMessageRepository<ASYNC extends boolean> {
  init(resovler: GeneralModuleResolver): void

  getNotPublished(): Asyncable<ASYNC, DeliveryBusMessage[]>

  markAsPublished(id: UuidType): Asyncable<ASYNC, unknown>

  subscribe(delivererToBus: DelivererToBus): unknown
}

type BusRepository = BusMessageRepository<boolean>;

export const BusMessageRepository = {
  instance(resolver: Repositoriable): BusRepository {
    return resolver.resolveRepo(BusMessageRepository) as BusRepository;
  },
};
