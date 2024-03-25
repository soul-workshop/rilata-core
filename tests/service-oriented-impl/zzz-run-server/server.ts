import { InjectCallerMiddleware } from '../../../src/app/middleware/inject-caller';
import { Middleware } from '../../../src/app/middleware/middleware';
import { OnlyPostMethodMiddleware } from '../../../src/app/middleware/only-post-method';
import { BunServer } from '../../../src/app/server/bun-server';
import { Constructor } from '../../../src/common/types';
import { UserJwtPayload } from '../auth/services/user/user-authentification/s-params';

export class ServiceModulesBunServer extends BunServer<UserJwtPayload> {
  protected middlewareCtors: Constructor<Middleware>[] = [
    OnlyPostMethodMiddleware,
    InjectCallerMiddleware,
  ];
}
