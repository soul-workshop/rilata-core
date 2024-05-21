import { GeneralServerResolver } from '../../../src/app/base.index';
import { Controller } from '../../../src/app/controller/controller';
import { Afterware } from '../../../src/app/http.index';
import { LogResponseAfterware } from '../../../src/app/middle-after-ware/afterwares/log-request';
import { Middleware } from '../../../src/app/middle-after-ware/middleware';
import { InjectCallerMiddleware } from '../../../src/app/middle-after-ware/middlewares/inject-caller';
import { BusBunServer } from '../../../src/app/server/bus-server';

export class BusRunServer extends BusBunServer {
  protected middlewares: Middleware<GeneralServerResolver>[] = [
    new InjectCallerMiddleware(),
  ];

  protected afterwares: Afterware<GeneralServerResolver>[] = [
    new LogResponseAfterware(),
  ];

  protected serverControllers: Controller<GeneralServerResolver>[] = [];
}
