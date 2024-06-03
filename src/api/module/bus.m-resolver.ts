import { Bus } from '../bus/bus';
import { DelivererToBus } from '../bus/deliverer-to-bus';
import { BusMessageRepository } from '../database/bus-message.repository';

export interface BusModuleResolver {
  getBus(): Bus

  getBusMessageRepository(): BusMessageRepository<boolean>

  getDelivererToBus(): DelivererToBus
}
