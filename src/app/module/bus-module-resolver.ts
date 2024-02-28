import { Bus } from '../bus/bus';
import { EventDeliverer } from '../event-deliverer/event-deliverer';
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
    this.getEventDeliverer().init(this);
  }

  getBus(): Bus {
    return this.serverResolver.getBus();
  }

  abstract getEventDeliverer(): EventDeliverer
}
