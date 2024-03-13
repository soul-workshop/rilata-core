import { Bus } from '../bus/bus';
import { DelivererToBus } from '../bus/deliverer-to-bus';
import { BusServerResolver } from '../server/bus-server-resolver';
import { Module } from './module';
import { ModuleResolver } from './module-resolver';
import { ModuleResolves } from './module-resolves';

export abstract class BusModuleResolver<
  M extends Module, MR extends ModuleResolves<M>
> extends ModuleResolver<M, MR> {
  declare protected serverResolver: BusServerResolver;

  /** инициализация выполняется классом server */
  init(module: M, serverResolver: BusServerResolver): void {
    super.init(module, serverResolver);
    this.getDelivererToBus().init(this);
  }

  getBus(): Bus {
    return this.serverResolver.getBus();
  }

  abstract getDelivererToBus(): DelivererToBus
}
