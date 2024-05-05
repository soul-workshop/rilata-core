import { CompanyCmdRepository } from './domain-object/company/repo';
import { CompanyCmdModule } from './module';
import { CompanyCmdResolves } from './resolves';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { DelivererToBus } from '../../../src/app/bus/deliverer-to-bus';
import { TimeoutCallbackDelivererToBus } from '../../../src/infra/deliverer-to-bus.ts/timeout-callback-impl';
import { UserJwtPayload } from '../../service-oriented-impl/auth/services/user/user-authentification/s-params';
import { BusModuleResolver } from '../../../src/app/module/bus.resolver';
import { Bus } from '../../../src/app/bus/bus';
import { BusMessageRepository } from '../../../src/app/database/bus-message.repository';
import { UowModuleResolver } from '../../../src/app/module/uow.module/resolver';
import { EventRepository } from '../../../src/app/database/event.repository';
import { BusServerResolver } from '../../../src/app/server/bus-server-resolver';

export class CompanyCmdModuleResolver extends UowModuleResolver<
  UserJwtPayload, CompanyCmdModule, CompanyCmdResolves
> implements BusModuleResolver {
  private delivererToBus = new TimeoutCallbackDelivererToBus();

  resolve(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    if (key === CompanyCmdRepository) return this.resolves.companyRepo;
    if (key === EventRepository) return this.resolves.eventRepo;
    throw this.getLogger().error(`not find repo to key: ${key}`);
  }

  resolveFacade(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getFacade not implemented.');
  }

  getBus(): Bus {
    return (this.serverResolver as unknown as BusServerResolver).getBus();
  }

  getBusMessageRepository(): BusMessageRepository {
    return this.resolves.busMessageRepo;
  }

  getDelivererToBus(): DelivererToBus {
    return this.delivererToBus;
  }
}
