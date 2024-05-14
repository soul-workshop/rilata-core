import { Controller } from '../../../src/app/controller/controller';
import { InjectCallerMiddleware } from '../../../src/app/middleware/inject-caller';
import { BunServer } from '../../../src/app/server/bun-server';
import { AboutController } from './controllers/about';

export class ServiceModulesBunServer extends BunServer {
  protected middlewares = [
    new InjectCallerMiddleware(),
  ];

  protected controllers: Controller[] = [
    new AboutController(),
  ];
}
