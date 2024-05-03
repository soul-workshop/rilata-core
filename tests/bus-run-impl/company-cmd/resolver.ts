import { CompanyCmdRepository } from './domain-object/company/repo';
import { CompanyCmdModule } from './module';
import { CompanyCmdResolves } from './resolves';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { BusModuleResolver } from '../../../src/app/module/bus-module-resolver';
import { DelivererToBus } from '../../../src/app/bus/deliverer-to-bus';
import { TimeoutCallbackDelivererToBus } from '../../../src/infra/deliverer-to-bus.ts/timeout-callback-impl';
import { EventRepository } from '../../../src/app/database/event-repository';
import { UserJwtPayload } from '../../service-oriented-impl/auth/services/user/user-authentification/s-params';

// eslint-disable-next-line max-len
export class CompanyCmdModuleResolver extends BusModuleResolver<
  UserJwtPayload, CompanyCmdModule, CompanyCmdResolves
> {
  private delivererToBus = new TimeoutCallbackDelivererToBus();

  resolve(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    if (key === CompanyCmdRepository) return this.resolves.companyRepo;
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
