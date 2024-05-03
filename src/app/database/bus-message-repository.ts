import { UuidType } from '../../common/types';
import { DelivererToBus } from '../bus/deliverer-to-bus';
import { DeliveryBusMessage } from '../bus/types';
import { GeneralModuleResolver } from '../module/types';
import { Repositoriable } from '../resolves/repositoriable';

export interface BusMessageRepository {
  init(resovler: GeneralModuleResolver): void

  getNotPublished(): Promise<DeliveryBusMessage[]>

  markAsPublished(id: UuidType): Promise<unknown>

  subscribe(delivererToBus: DelivererToBus): unknown
}

type BusRepository = BusMessageRepository;
export const BusMessageRepository = {
  instance(resolver: Repositoriable): BusRepository {
    return resolver.resolveRepo(BusMessageRepository) as BusRepository;
  },
};
