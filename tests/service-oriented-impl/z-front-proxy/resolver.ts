/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModuleResolver } from '../../../src/app/module/module-resolver';
import { ModuleConfig } from '../../../src/app/module/types';
import { ModuleResolveInstance } from '../../../src/app/resolves/types';
import { ServerResolver } from '../../../src/app/server/server-resolver';
import { AuthFacade } from '../auth/facade';
import { CompanyFacade } from '../company/facade';
import { SubjectFacade } from '../subject/facade';
import { FrontProxyModule } from './module';
import { FrontendProxyResolves } from './resolves';

export class FrontendProxyModuleResolver extends ModuleResolver<
  FrontProxyModule, FrontendProxyResolves
> {
  protected moduleConfig: ModuleConfig = {
    ModuleUrl: '/api/frontend-proxy-module/',
  };

  // override without db.init()
  init(module: FrontProxyModule, serverResolver: ServerResolver): void {
    this.module = module;
    this.serverResolver = serverResolver;
    this.resolves.authFacade.init(this);
    this.resolves.subjectFacade.init(this);
    this.resolves.companyFacade.init(this);
  }

  getRealisation(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  getRepository(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('not be called in read module');
  }

  getFacade(key: unknown): ModuleResolveInstance {
    if (key === AuthFacade) return this.resolves.authFacade;
    if (key === SubjectFacade) return this.resolves.subjectFacade;
    if (key === CompanyFacade) return this.resolves.companyFacade;
    throw this.getLogger().error(`not find facade for key: ${key}`);
  }
}
