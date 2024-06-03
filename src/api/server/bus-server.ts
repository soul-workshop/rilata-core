import { SubcribeToBusMessage } from '../bus/types';
import { BunServer } from './bun-server';
import { BusServerResolver } from './bus.s-resolver';
import { GeneralServerResolver } from './types';

export abstract class BusBunServer extends BunServer {
  declare protected resolver: GeneralServerResolver;

  init(serverResolver: GeneralServerResolver): void {
    super.init(serverResolver);
    this.subscribeToBus();
  }

  protected subscribeToBus(): void {
    this.modules.forEach((module) => {
      const busResolver = this.resolver as unknown as BusServerResolver;
      const bus = busResolver.getBus();
      module.eventServices.forEach((service) => {
        const eventSubscribe: SubcribeToBusMessage = {
          type: service.busMessageType,
          busMessageName: service.inputDodName,
          publishModuleName: service.eventModuleName,
          handlerModuleName: service.moduleName,
          handlerServiceName: service.serviceName,
        };
        bus.subscribe(eventSubscribe);
      });
    });
  }
}
