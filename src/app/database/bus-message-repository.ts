import { UuidType } from '../../common/types';
import { DelivererToBus } from '../bus/deliverer-to-bus';
import { DeliveryBusMessage } from '../bus/types';
import { GeneralModuleResolver } from '../module/types';
import { Repositoriable } from '../resolves/repositoriable';

export interface BusMessageRepository<R extends Record<string, unknown>> {
  init(resovler: GeneralModuleResolver): void

  getBusMessage(busMesssageId: UuidType): Promise<R | undefined>

  busMessageIsExist(id: UuidType): Promise<boolean>

  getNotPublished(): Promise<DeliveryBusMessage[]>

  markAsPublished(id: UuidType): Promise<void>

  subscribe(delivererToBus: DelivererToBus): void
}

type BusRepository = BusMessageRepository<Record<string, unknown>>;
export const BusMessageRepository = {
  instance(resolver: Repositoriable): BusRepository {
    return resolver.resolveRepo(BusMessageRepository) as BusRepository;
  },
};
