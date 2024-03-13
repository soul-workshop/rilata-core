import { ModuleConfig } from '../../../src/app/module/types';
import { CompanyReadResolves } from './resolves';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { CompanyReadModule } from './module';
import { CompanyReadRepository } from './domain/company/repo';
import { BusModuleResolver } from '../../../src/app/module/bus-module-resolver';
import { DelivererToBus } from '../../../src/app/bus/deliverer-to-bus';
import { TimeoutCallbackDelivererToBus } from '../../../src/infra/deliverer-to-bus.ts/timeout-callback-impl';
import { EventRepository } from '../../../src/app/database/event-repository';
import { BusMessageRepository } from '../../../src/app/database/bus-message-repository';

// eslint-disable-next-line max-len
export class CompanyReadModuleResolver extends BusModuleResolver<CompanyReadModule, CompanyReadResolves> {
  protected moduleConfig: ModuleConfig = {
    ModuleUrl: '/api/company-read-module/',
  };

  private delivererToBus = new TimeoutCallbackDelivererToBus();

  getRealisation(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  getRepository(key: unknown): ModuleResolveInstance {
    if (key === CompanyReadRepository) return this.resolves.companyRepo;
    if (key === EventRepository || key === BusMessageRepository) {
      return this.resolves.busMessageRepo;
    }
    throw this.getLogger().error(`not find repo to key: ${key}`);
  }

  getFacade(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getFacade not implemented.');
  }

  getDelivererToBus(): DelivererToBus {
    return this.delivererToBus;
  }
}
