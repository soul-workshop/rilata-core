import { InjectCallerMiddleware } from '../../../src/app/middleware/inject-caller';
import { Middleware } from '../../../src/app/middleware/middleware';
import { OnlyPostMethodMiddleware } from '../../../src/app/middleware/only-post-method';
import { BusBunServer } from '../../../src/app/server/bus-server';
import { Constructor } from '../../../src/common/types';
import { UserJwtPayload } from '../types';

export class BusRunServer extends BusBunServer<UserJwtPayload> {
  protected middlewareCtors: Constructor<Middleware>[] = [
    OnlyPostMethodMiddleware,
    InjectCallerMiddleware,
  ];
}
