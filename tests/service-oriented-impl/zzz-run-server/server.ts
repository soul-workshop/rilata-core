import { GeneralServerResolver } from '../../../src/app/base.index';
import { Controller } from '../../../src/app/controller/controller';
import { Afterware, InjectCallerMiddleware } from '../../../src/app/http.index';
import { LogResponseAfterware } from '../../../src/app/middle-after-ware/afterwares/log-request';
import { BunServer } from '../../../src/app/server/bun-server';
import { AboutController } from './controllers/about';

export class ServiceModulesBunServer extends BunServer {
  protected middlewares = [
    new InjectCallerMiddleware(),
  ];

  protected afterwares: Afterware<GeneralServerResolver>[] = [
    new LogResponseAfterware(),
  ];

  protected serverControllers: Controller<GeneralServerResolver>[] = [
    new AboutController(),
  ];
}
