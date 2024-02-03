import { BusEventPublish, DeliveryEvent } from '../bus/types';
import { Module } from '../module/module';
import { ModuleResolver } from '../module/module-resolver';

export class EventDelivererWorkerProxy {
  protected worker!: Worker;

  init(resolver: ModuleResolver<Module>): void {
    this.worker = new Worker(new URL(resolver.getModuleConfig().eventDelivererPath));
    this.worker.onmessage = async (deliveryEvent: MessageEvent<DeliveryEvent>): Promise<void> => {
      const eventPublish: BusEventPublish = {
        event: deliveryEvent.data.event,
        eventName: deliveryEvent.data.eventName,
        moduleName: resolver.getModule().moduleName,
      };
      await resolver.getBus().publish(eventPublish);
    };
  }
}
