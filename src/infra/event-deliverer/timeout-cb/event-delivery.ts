import { DeliveryEventType, PublishedEvent } from '../../../app/bus/types';
import { EventDeliverer } from '../../../app/event-deliverer/event-deliverer';
import { BusModuleResolver } from '../../../app/module/bus-module-resolver';
import { Module } from '../../../app/module/module';
import { ModuleResolves } from '../../../app/module/module-resolves';

export class TimeoutCallbackEventDeliverer implements EventDeliverer {
  protected moduleResolver!: BusModuleResolver<Module, ModuleResolves<Module>>;

  init(moduleResolver: BusModuleResolver<Module, ModuleResolves<Module>>): void {
    this.moduleResolver = moduleResolver;
    this.moduleResolver.getEventRepository().subscribe(this);
  }

  async handle(deliveryEvent: DeliveryEventType): Promise<void> {
    const publishEvent: PublishedEvent = {
      event: deliveryEvent.event,
      eventName: deliveryEvent.eventName,
      moduleName: this.moduleResolver.getModule().moduleName,
      aRootId: deliveryEvent.aRootId,
    };

    // запускаем обработчик после выполнения всех обещаний, т.е. ставим в очередь
    setTimeout(async () => {
      await this.moduleResolver.getBus().publish(publishEvent);
      this.moduleResolver.getEventRepository().markAsPublished(deliveryEvent.requestId);
    }, 0);
  }
}
