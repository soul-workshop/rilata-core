import { GeneralServerResolver } from '../../../src/api/base.index';
import { Controller } from '../../../src/api/controller/controller';
import { Afterware, InjectCallerMiddleware } from '../../../src/api/http.index';
import { LogResponseAfterware } from '../../../src/api/middle-after-ware/afterwares/log-request';
import { BunServer } from '../../../src/api/server/bun-server';
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
