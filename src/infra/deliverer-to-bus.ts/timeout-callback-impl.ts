import { DelivererToBus } from '../../app/bus/deliverer-to-bus';
import { DeliveryBusMessage, PublishBusMessage } from '../../app/bus/types';
import { BusMessageRepository } from '../../app/database/bus-message-repository';
import { BusModuleResolver } from '../../app/module/bus-module-resolver';
import { Module } from '../../app/module/module';
import { ModuleResolves } from '../../app/module/module-resolves';

export class TimeoutCallbackDelivererToBus implements DelivererToBus {
  protected moduleResolver!: BusModuleResolver<Module, ModuleResolves<Module>>;

  init(moduleResolver: BusModuleResolver<Module, ModuleResolves<Module>>): void {
    this.moduleResolver = moduleResolver;
    BusMessageRepository.instance(moduleResolver).subscribe(this);
  }

  async handle(deliveryEvent: DeliveryBusMessage): Promise<void> {
    const publishEvent: PublishBusMessage = {
      ...deliveryEvent,
      publishModuleName: this.moduleResolver.getModuleName(),
    };

    // запускаем обработчик после выполнения всех обещаний, т.е. ставим в очередь
    setTimeout(async () => {
      await this.moduleResolver.getBus().publish(publishEvent);
      const busMsgRepo = BusMessageRepository.instance(this.moduleResolver);
      busMsgRepo.markAsPublished(deliveryEvent.busMessageId);
    }, 0);
  }
}
