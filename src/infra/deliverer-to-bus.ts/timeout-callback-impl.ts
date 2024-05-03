import { DelivererToBus } from '../../app/bus/deliverer-to-bus';
import { DeliveryBusMessage, PublishBusMessage } from '../../app/bus/types';
import { BusModuleResolver } from '../../app/module/bus-module-resolver';
import { BusModuleResolves } from '../../app/module/bus-module-resolves';
import { Module } from '../../app/module/module';
import { DTO } from '../../domain/dto';

export class TimeoutCallbackDelivererToBus implements DelivererToBus {
  protected moduleResolver!: BusModuleResolver<DTO, Module<DTO>, BusModuleResolves<Module<DTO>>>;

  init(moduleResolver: BusModuleResolver<DTO, Module<DTO>, BusModuleResolves<Module<DTO>>>): void {
    this.moduleResolver = moduleResolver;
    moduleResolver.getBusMessageRepository().subscribe(this);
  }

  async handle(deliveryEvent: DeliveryBusMessage): Promise<void> {
    const publishEvent: PublishBusMessage = {
      ...deliveryEvent,
      publishModuleName: this.moduleResolver.getModuleName(),
    };

    // запускаем обработчик после выполнения всех обещаний, т.е. ставим в очередь
    setTimeout(async () => {
      await this.moduleResolver.getBus().publish(publishEvent);
      const busMsgRepo = this.moduleResolver.getBusMessageRepository();
      busMsgRepo.markAsPublished(deliveryEvent.id);
    }, 0);
  }
}
