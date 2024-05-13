import { Controller } from '../../../src/app/controller/controller';
import { Middleware } from '../../../src/app/middleware/middleware';
import { InjectCallerMiddleware } from '../../../src/app/middleware/prepared/inject-caller';
import { BusBunServer } from '../../../src/app/server/bus-server';

export class BusRunServer extends BusBunServer {
  protected middlewares: Middleware[] = [
    new InjectCallerMiddleware(),
  ];

  protected controllers: Controller[] = [];
}
