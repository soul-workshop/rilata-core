import { DeliveryEventType } from '../bus/types';

export interface EventDeliverer {
  /** publish not published events from event repository and subscribe to new events */
  init(...args: unknown[]): void

  /** handle new event */
  handle(deliveryEvent: DeliveryEventType): Promise<void>
}
