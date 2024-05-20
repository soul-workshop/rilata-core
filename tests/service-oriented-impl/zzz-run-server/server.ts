import { GeneralServerResolver } from '../../../src/app/base.index';
import { Controller } from '../../../src/app/controller/controller';
import { InjectCallerMiddleware } from '../../../src/app/http.index';
import { BunServer } from '../../../src/app/server/bun-server';
import { AboutController } from './controllers/about';

export class ServiceModulesBunServer extends BunServer {
  protected middlewares = [
    new InjectCallerMiddleware(),
  ];

  protected serverControllers: Controller<GeneralServerResolver>[] = [
    new AboutController(),
  ];
}
