import { DTO } from '../../domain/dto';
import { SubcribeToBusMessage } from '../bus/types';
import { BunServer } from './bun-server';
import { BusServerResolver } from './bus-server-resolver';

export abstract class BusBunServer<JWT_P extends DTO> extends BunServer<JWT_P> {
  declare protected resolver: BusServerResolver<JWT_P>;

  init(serverResolver: BusServerResolver<JWT_P>): void {
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
