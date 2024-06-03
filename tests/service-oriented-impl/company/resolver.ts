import { CompanyRepository } from './domain-object/company/repo';
import { CompanyResolves } from './resolves';
import { AuthFacade } from '../auth/facade';
import { SubjectFacade } from '../subject/facade';
import { ModuleResolver } from '../../../src/api/module/m-resolver';
import { GeneralServerResolver } from '../../../src/api/server/types';
import { EventRepository } from '../../../src/api/database/event.repository';

export class CompanyModuleResolver extends ModuleResolver<
  GeneralServerResolver, CompanyResolves
> {
  resolve(key: unknown): unknown {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): unknown {
    if (key === CompanyRepository) return this.resolves.companyRepo;
    if (key === EventRepository) {
      return this.resolves.eventRepo;
    }
    throw this.getLogger().error(`not find repo to key: ${key}`);
  }

  resolveFacade(key: unknown): unknown {
    if (key === AuthFacade) return this.resolves.authFacade;
    if (key === SubjectFacade) return this.resolves.subjectFacade;
    throw this.getLogger().error(`not find facade to key: ${key}`);
  }
}
