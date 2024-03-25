import { ServerStarter } from '../../../src/app/server/server-starter';
import { CompanyCmdModule } from '../company-cmd/module';
import { CompanyCmdModuleResolver } from '../company-cmd/resolver';
import { CompanyReadModule } from '../company-read/module';
import { CompanyReadModuleResolver } from '../company-read/resolver';
import { UserJwtPayload } from '../types';
import { getCompanyCmdResolves } from './module-resolves/company-cmd-resolves';
import { getCompanyReadResolves } from './module-resolves/company-read-resolves';
import { serverResolves } from './resolves';
import { BusRunServer } from './server';

type AllServerModules = CompanyCmdModule | CompanyReadModule;

export const serverStarter = new ServerStarter<UserJwtPayload, AllServerModules>(
  BusRunServer,
  serverResolves,
  [
    [CompanyCmdModule, CompanyCmdModuleResolver, getCompanyCmdResolves()],
    [CompanyReadModule, CompanyReadModuleResolver, getCompanyReadResolves()],
  ],
);
