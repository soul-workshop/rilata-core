import { DeliveryBusMessage } from '../bus/types';

export interface DelivererToBus {
  init(...args: unknown[]): void

  /** delivery new event to bus */
  handle(deliveryBusMessage: DeliveryBusMessage): Promise<void>
}
