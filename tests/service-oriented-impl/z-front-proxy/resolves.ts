import { ModuleResolves } from '../../../src/app/module/module-resolves';
import { AuthFacade } from '../auth/facade';
import { CompanyFacade } from '../company/facade';
import { SubjectFacade } from '../subject/facade';
import { FrontProxyModule } from './module';

export type FrontendProxyResolves = ModuleResolves<FrontProxyModule> & {
  moduleUrl: '/api/frontend-proxy-module/',
  authFacade: AuthFacade,
  subjectFacade: SubjectFacade,
  companyFacade: CompanyFacade,
}
