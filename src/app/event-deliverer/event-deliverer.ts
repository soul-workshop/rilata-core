import { DeliveryEvent } from '../bus/types';
import { DomainEventRepository } from '../database/domain-event-repository';

export class EventDeliverer {
  constructor(protected eventRepo: DomainEventRepository) {
    eventRepo.subscribe(this.handle);
  }

  init(): void {
    this.eventRepo.getNotPublishedEvents().forEach((event) => {
      this.handle(event);
    });
  }

  protected async handle(deliveryEvent: DeliveryEvent): Promise<void> {
    postMessage(deliveryEvent); // send to parent thread
    this.eventRepo.markAsPublished(deliveryEvent.actionId);
  }
}
