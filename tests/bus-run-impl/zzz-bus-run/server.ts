import { AsyncLocalStorage } from 'async_hooks';
import { storeDispatcher } from '../../../src/app/async-store/store-dispatcher';
import { InjectCallerMiddleware } from '../../../src/app/middleware/inject-caller';
import { Middleware } from '../../../src/app/middleware/middleware';
import { OnlyPostMethodMiddleware } from '../../../src/app/middleware/only-post-method';
import { Module } from '../../../src/app/module/module';
import { BusBunServer } from '../../../src/app/server/bus-server';
import { BusServerResolver } from '../../../src/app/server/bus-server-resolver';
import { ModuleConstructors } from '../../../src/app/server/types';
import { Constructor } from '../../../src/common/types';
import { CompanyCmdModule } from '../company-cmd/module';
import { CompanyCmdModuleResolver } from '../company-cmd/resolver';
import { CompanyReadModule } from '../company-read/module';
import { CompanyReadModuleResolver } from '../company-read/resolver';
import { getCompanyCmdResolves } from './module-resolves/company-cmd-resolves';
import { getCompanyReadResolves } from './module-resolves/company-read-resolves';

export class BusRunServer extends BusBunServer {
  protected middlewareCtors: Constructor<Middleware>[] = [
    OnlyPostMethodMiddleware,
    InjectCallerMiddleware,
  ];

  protected moduleTupleCtors: ModuleConstructors<Module>[] = [
    [CompanyCmdModule, CompanyCmdModuleResolver, getCompanyCmdResolves],
    [CompanyReadModule, CompanyReadModuleResolver, getCompanyReadResolves],
  ];

  init(serverResolver: BusServerResolver): void {
    super.init(serverResolver);
    this.logger.info('start set store dispatcher for server');
    storeDispatcher.setThreadStore(new AsyncLocalStorage());
    this.logger.info('finish set store dispatcher for server');
  }
}
