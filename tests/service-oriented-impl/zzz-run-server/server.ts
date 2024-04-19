import { Controller } from '../../../src/app/controller/controller';
import { InjectCallerMiddleware } from '../../../src/app/middleware/inject-caller';
import { BunServer } from '../../../src/app/server/bun-server';
import { UserJwtPayload } from '../auth/services/user/user-authentification/s-params';
import { AboutController } from './controllers/about';

export class ServiceModulesBunServer extends BunServer<UserJwtPayload> {
  protected middlewares = [
    new InjectCallerMiddleware(),
  ];

  protected controllers: Controller[] = [
    new AboutController(),
  ];
}
