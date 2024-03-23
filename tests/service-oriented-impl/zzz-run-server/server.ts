import { AsyncLocalStorage } from 'async_hooks';
import { storeDispatcher } from '../../../src/app/async-store/store-dispatcher';
import { InjectCallerMiddleware } from '../../../src/app/middleware/inject-caller';
import { Middleware } from '../../../src/app/middleware/middleware';
import { OnlyPostMethodMiddleware } from '../../../src/app/middleware/only-post-method';
import { BunServer } from '../../../src/app/server/bun-server';
import { ServerResolver } from '../../../src/app/server/server-resolver';
import { ModuleConstructors } from '../../../src/app/server/types';
import { Constructor } from '../../../src/common/types';
import { AuthModule } from '../auth/module';
import { AuthModuleResolver } from '../auth/resolver';
import { UserJwtPayload } from '../auth/services/user/user-authentification/s-params';
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

export class ServiceModulesBunServer extends BunServer<UserJwtPayload> {
  protected middlewareCtors: Constructor<Middleware>[] = [
    OnlyPostMethodMiddleware,
    InjectCallerMiddleware,
  ];

  protected moduleTupleCtors: ModuleConstructors<UserJwtPayload>[] = [
    [AuthModule, AuthModuleResolver, getAuthResolves],
    [SubjectModule, SubjectModuleResolver, getSubjectResolves],
    [CompanyModule, CompanyModuleResolver, getCompanyResolves],
    [FrontProxyModule, FrontendProxyModuleResolver, getFrontProxyResolves],
  ];

  init(serverResolver: ServerResolver<UserJwtPayload>): void {
    super.init(serverResolver);
    this.logger.info('start set store dispatcher for server');
    storeDispatcher.setThreadStore(new AsyncLocalStorage());
    this.logger.info('finish set store dispatcher for server');
  }
}
