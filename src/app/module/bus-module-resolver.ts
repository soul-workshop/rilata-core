import { DTO } from '../../domain/dto';
import { Bus } from '../bus/bus';
import { DelivererToBus } from '../bus/deliverer-to-bus';
import { BusMessageRepository } from '../database/bus-message-repository';
import { BusServerResolver } from '../server/bus-server-resolver';
import { BusModuleResolves } from './bus-module-resolves';
import { Module } from './module';
import { ModuleResolver } from './module-resolver';

export abstract class BusModuleResolver<
  JWT_P extends DTO, M extends Module<JWT_P>, MR extends BusModuleResolves<M>
> extends ModuleResolver<JWT_P, M, MR> {
  declare protected serverResolver: BusServerResolver<JWT_P>;

  init(module: M, serverResolver: BusServerResolver<JWT_P>): void {
    super.init(module, serverResolver);
    this.getDelivererToBus().init(this);
  }

  getBus(): Bus {
    return this.serverResolver.getBus();
  }

  getBusMessageRepository(): BusMessageRepository {
    return this.resolves.busMessageRepo;
  }

  abstract getDelivererToBus(): DelivererToBus
}
