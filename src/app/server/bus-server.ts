import { SubcribeToBusMessage } from '../bus/types';
import { BunServer } from './bun-server';
import { BusServerResolver } from './bus-server-resolver';

export abstract class BusBunServer extends BunServer {
  declare protected resolver: BusServerResolver;

  init(serverResolver: BusServerResolver): void {
    super.init(serverResolver);
    this.subscribeToBus();
  }

  protected subscribeToBus(): void {
    this.runModules.forEach((module) => {
      const bus = this.resolver.getBus();
      module.eventServices.forEach((service) => {
        const eventSubscribe: SubcribeToBusMessage = {
          type: service.eventBusMessateType,
          busMessageName: service.serviceName,
          publishModuleName: service.publishModuleName,
          handlerModuleName: service.handlerModuleName,
        };
        bus.subscribe(eventSubscribe);
      });
    });
  }
}
