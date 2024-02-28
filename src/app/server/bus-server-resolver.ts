import { Bus } from '../bus/bus';
import { RilataServer } from './server';
import { ServerResolver } from './server-resolver';

export abstract class BusServerResolver extends ServerResolver {
  /** инициализация выполняется классом server */
  init(server: RilataServer): void {
    super.init(server);
    this.getBus().init(this);
  }

  stop(): void {
    super.stop();
    this.getBus().stop();
  }

  abstract getBus(): Bus
}
