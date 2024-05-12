import { ServerStarter } from '../../../src/app/server/server-starter';
import { serverResolves } from './resolves';
import { ServiceModulesBunServer } from './server';
import { AuthModule } from '../auth/module';
import { AuthModuleResolver } from '../auth/resolver';
import { CompanyModule } from '../company/module';
import { CompanyModuleResolver } from '../company/resolver';
import { SubjectModule } from '../subject/module';
import { SubjectModuleResolver } from '../subject/resolver';
import { FrontProxyModule } from '../z-front-proxy/module';
import { FrontendProxyModuleResolver } from '../z-front-proxy/resolver';
import { getAuthResolves } from './module-resolves/auth-resolves';
import { getCompanyResolves } from './module-resolves/company-resolves';
import { getFrontProxyResolves } from './module-resolves/front-proxy-resolves';
import { getSubjectResolves } from './module-resolves/subject-resolves';

type AllServerModules = AuthModule | SubjectModule | CompanyModule | FrontProxyModule;

export const serverStarter = new ServerStarter<AllServerModules>(
  ServiceModulesBunServer,
  serverResolves,
  [
    [AuthModule, AuthModuleResolver, getAuthResolves()],
    [SubjectModule, SubjectModuleResolver, getSubjectResolves()],
    [CompanyModule, CompanyModuleResolver, getCompanyResolves()],
    [FrontProxyModule, FrontendProxyModuleResolver, getFrontProxyResolves()],
  ],
);
