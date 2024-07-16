import { Afterware } from '#api/middle-after-ware/afterware.js';
import { GeneralServerResolver } from '#api/server/types.js';
import { Controller } from '../../../src/api/controller/controller.js';
import { LogResponseAfterware } from '../../../src/api/middle-after-ware/afterwares/log-request.js';
import { Middleware } from '../../../src/api/middle-after-ware/middleware.js';
import { InjectCallerMiddleware } from '../../../src/api/middle-after-ware/middlewares/inject-caller.js';
import { BusBunServer } from '../../../src/api/server/bus-server.js';

export class BusRunServer extends BusBunServer {
  protected middlewares: Middleware<GeneralServerResolver>[] = [
    new InjectCallerMiddleware(),
  ];

  protected afterwares: Afterware<GeneralServerResolver>[] = [
    new LogResponseAfterware(),
  ];

  protected serverControllers: Controller<GeneralServerResolver>[] = [];
}
