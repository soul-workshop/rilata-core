import { GeneralServerResolver } from '../../../src/api/base.index';
import { Controller } from '../../../src/api/controller/controller';
import { Afterware } from '../../../src/api/http.index';
import { LogResponseAfterware } from '../../../src/api/middle-after-ware/afterwares/log-request';
import { Middleware } from '../../../src/api/middle-after-ware/middleware';
import { InjectCallerMiddleware } from '../../../src/api/middle-after-ware/middlewares/inject-caller';
import { BusBunServer } from '../../../src/api/server/bus-server';

export class BusRunServer extends BusBunServer {
  protected middlewares: Middleware<GeneralServerResolver>[] = [
    new InjectCallerMiddleware(),
  ];

  protected afterwares: Afterware<GeneralServerResolver>[] = [
    new LogResponseAfterware(),
  ];

  protected serverControllers: Controller<GeneralServerResolver>[] = [];
}
