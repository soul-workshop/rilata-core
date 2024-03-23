import { DTO } from '../../domain/dto';
import { Bus } from '../bus/bus';
import { DelivererToBus } from '../bus/deliverer-to-bus';
import { BusServerResolver } from '../server/bus-server-resolver';
import { Module } from './module';
import { ModuleResolver } from './module-resolver';
import { ModuleResolves } from './module-resolves';

export abstract class BusModuleResolver<
  JWT_P extends DTO, M extends Module<JWT_P>, MR extends ModuleResolves<M>
> extends ModuleResolver<JWT_P, M, MR> {
  declare protected serverResolver: BusServerResolver<JWT_P>;

  /** инициализация выполняется классом server */
  init(module: M, serverResolver: BusServerResolver<JWT_P>): void {
    super.init(module, serverResolver);
    this.getDelivererToBus().init(this);
  }

  getBus(): Bus {
    return this.serverResolver.getBus();
  }

  abstract getDelivererToBus(): DelivererToBus
}
