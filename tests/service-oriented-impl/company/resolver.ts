import { CompanyRepository } from './domain-object/company/repo';
import { CompanyResolves } from './resolves';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { AuthFacade } from '../auth/facade';
import { SubjectFacade } from '../subject/facade';
import { ModuleResolver } from '../../../src/app/module/m-resolver';
import { GeneralServerResolver } from '../../../src/app/server/types';
import { EventRepository } from '../../../src/app/database/event.repository';

export class CompanyModuleResolver extends ModuleResolver<
  GeneralServerResolver, CompanyResolves
> {
  resolve(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    if (key === CompanyRepository) return this.resolves.companyRepo;
    if (key === EventRepository) {
      return this.resolves.eventRepo;
    }
    throw this.getLogger().error(`not find repo to key: ${key}`);
  }

  resolveFacade(key: unknown): ModuleResolveInstance {
    if (key === AuthFacade) return this.resolves.authFacade;
    if (key === SubjectFacade) return this.resolves.subjectFacade;
    throw this.getLogger().error(`not find facade to key: ${key}`);
  }
}
