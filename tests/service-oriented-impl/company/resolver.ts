import { ModuleResolver } from '../../../src/app/module/module-resolver';
import { CompanyRepository } from './domain-object/company/repo';
import { CompanyModule } from './module';
import { CompanyResolves } from './resolves';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { AuthFacade } from '../auth/facade';
import { SubjectFacade } from '../subject/facade';
import { EventRepository } from '../../../src/app/database/event-repository';
import { BusMessageRepository } from '../../../src/app/database/bus-message-repository';
import { UserJwtPayload } from '../auth/services/user/user-authentification/s-params';

export class CompanyModuleResolver extends ModuleResolver<
  UserJwtPayload, CompanyModule, CompanyResolves
> {
  getRealisation(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  getRepository(key: unknown): ModuleResolveInstance {
    if (key === CompanyRepository) return this.resolves.companyRepo;
    if (key === EventRepository || key === BusMessageRepository) {
      return this.resolves.busMessageRepo;
    }
    throw this.getLogger().error(`not find repo to key: ${key}`);
  }

  getFacade(key: unknown): ModuleResolveInstance {
    if (key === AuthFacade) return this.resolves.authFacade;
    if (key === SubjectFacade) return this.resolves.subjectFacade;
    throw this.getLogger().error(`not find facade to key: ${key}`);
  }
}
