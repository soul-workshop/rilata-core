import { Controller } from '../../../src/app/controller/controller';
import { InjectCallerMiddleware } from '../../../src/app/middleware/inject-caller';
import { Middleware } from '../../../src/app/middleware/middleware';
import { BusBunServer } from '../../../src/app/server/bus-server';
import { UserJwtPayload } from '../types';

export class BusRunServer extends BusBunServer<UserJwtPayload> {
  protected middlewares: Middleware[] = [
    new InjectCallerMiddleware(),
  ];

  protected controllers: Controller[] = [];
}
