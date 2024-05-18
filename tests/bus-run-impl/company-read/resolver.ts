/* eslint-disable @typescript-eslint/no-unused-vars */
import { CompanyReadResolves } from './resolves';
import { CompanyReadRepository } from './domain/company/repo';
import { DelivererToBus } from '../../../src/app/bus/deliverer-to-bus';
import { TimeoutCallbackDelivererToBus } from '../../../src/infra/deliverer-to-bus/timeout-callback-impl';
import { ModuleResolver } from '../../../src/app/module/m-resolver';
import { BusRunServerResolver } from '../zzz-bus-run/s-resolver';
import { BusModuleResolver } from '../../../src/app/module/bus.m-resolver';
import { Bus } from '../../../src/app/bus/bus';
import { BusMessageRepository } from '../../../src/app/database/bus-message.repository';
import { EventRepository } from '../../../src/app/database/event.repository';
import { CompanyReadModule } from './module';

export class CompanyReadModuleResolver extends ModuleResolver<
  BusRunServerResolver, CompanyReadResolves
> implements BusModuleResolver {
  private delivererToBus = new TimeoutCallbackDelivererToBus();

  init(module: CompanyReadModule, sResolver: BusRunServerResolver): void {
    super.init(module, sResolver);
    this.delivererToBus.init(this);
    this.resolves.busMessageRepo.subscribe(this.delivererToBus);
  }

  resolve(key: unknown): unknown {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): unknown {
    if (key === CompanyReadRepository) return this.resolves.companyRepo;
    if (key === EventRepository) return this.resolves.eventRepo;
    if (key === BusMessageRepository) return this.resolves.busMessageRepo;
    throw this.getLogger().error(`not find repo to key: ${key}`);
  }

  resolveFacade(key: unknown): unknown {
    throw this.getLogger().error('Method getFacade not implemented.');
  }

  getBus(): Bus {
    return this.serverResolver.getBus();
  }

  getBusMessageRepository(): BusMessageRepository<true> {
    return this.resolves.busMessageRepo;
  }

  getDelivererToBus(): DelivererToBus {
    return this.delivererToBus;
  }
}
