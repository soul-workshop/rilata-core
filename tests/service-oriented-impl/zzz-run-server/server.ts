import { Afterware } from '#api/middle-after-ware/afterware.js';
import { InjectCallerMiddleware } from '#api/middle-after-ware/middlewares/inject-caller.js';
import { GeneralServerResolver } from '#api/server/types.js';
import { Controller } from '../../../src/api/controller/controller.js';
import { LogResponseAfterware } from '../../../src/api/middle-after-ware/afterwares/log-request.js';
import { BunServer } from '../../../src/api/server/bun-server.js';
import { AboutController } from './controllers/about.js';

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
