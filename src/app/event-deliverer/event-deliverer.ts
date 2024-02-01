import { UuidType } from '../../common/types';
import { Bus } from '../bus/bus';
import { BusEventPublish } from '../bus/types';
import { DomainEventRepository } from '../database/domain-event-repository';
import { EventAsJson } from '../database/types';
import { ModuleResolver } from '../resolves/module-resolver';

export class EventDeliverer {
  protected resolver!: ModuleResolver;

  constructor(protected bus: Bus, protected eventRepo: DomainEventRepository) {}

  init(resolver: ModuleResolver): void {
    this.resolver = resolver;
  }

  async handle(eventName: string, actionId: UuidType, event: EventAsJson): Promise<void> {
    const eventPublish: BusEventPublish = {
      event,
      eventName,
      moduleName: this.resolver.getModule().moduleName,
    };
    await this.bus.publish(eventPublish);
    this.eventRepo.markAsPublished(actionId);
  }
}
