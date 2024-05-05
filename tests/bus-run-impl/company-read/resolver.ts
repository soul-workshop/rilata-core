import { CompanyReadResolves } from './resolves';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { CompanyReadModule } from './module';
import { CompanyReadRepository } from './domain/company/repo';
import { DelivererToBus } from '../../../src/app/bus/deliverer-to-bus';
import { TimeoutCallbackDelivererToBus } from '../../../src/infra/deliverer-to-bus.ts/timeout-callback-impl';
import { UserJwtPayload } from '../../service-oriented-impl/auth/services/user/user-authentification/s-params';
import { UowModuleResolver } from '../../../src/app/module/uow.module/resolver';
import { BusModuleResolver } from '../../../src/app/module/bus.resolver';

export class CompanyReadModuleResolver extends UowModuleResolver<
  UserJwtPayload, CompanyReadModule, CompanyReadResolves
> implements BusModuleResolver {
  private delivererToBus = new TimeoutCallbackDelivererToBus();

  resolve(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    if (key === CompanyReadRepository) return this.resolves.companyRepo;
    if (key === EventRepository) {
      return this.resolves.busMessageRepo;
    }
    throw this.getLogger().error(`not find repo to key: ${key}`);
  }

  resolveFacade(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getFacade not implemented.');
  }

  getDelivererToBus(): DelivererToBus {
    return this.delivererToBus;
  }
}
