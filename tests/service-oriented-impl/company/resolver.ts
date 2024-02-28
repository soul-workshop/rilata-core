import { ModuleResolver } from '../../../src/app/module/module-resolver';
import { ModuleConfig } from '../../../src/app/module/types';
import { CompanyRepository } from './domain-object/company/repo';
import { CompanyModule } from './module';
import { CompanyResolves } from './resolves';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { AuthFacade } from '../auth/facade';
import { SubjectFacade } from '../subject/facade';

export class CompanyModuleResolver extends ModuleResolver<CompanyModule, CompanyResolves> {
  protected moduleConfig: ModuleConfig = {
    ModuleUrl: '/api/company-module/',
  };

  getRealisation(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  getRepository(key: unknown): ModuleResolveInstance {
    if (key === CompanyRepository) return this.resolves.companyRepo;
    throw this.getLogger().error(`not find repo to key: ${key}`);
  }

  getFacade(key: unknown): ModuleResolveInstance {
    if (key === AuthFacade) return this.resolves.authFacade;
    if (key === SubjectFacade) return this.resolves.subjectFacade;
    throw this.getLogger().error(`not find facade to key: ${key}`);
  }
}
