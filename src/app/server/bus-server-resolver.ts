import { DTO } from '../../domain/dto';
import { Bus } from '../bus/bus';
import { BusBunServer } from './bus-server';
import { ServerResolver } from './server-resolver';
import { BusServerResolves } from './server-resolves';

export class BusServerResolver<JWT_P extends DTO> extends ServerResolver<JWT_P> {
  constructor(protected resolves: BusServerResolves<JWT_P>) {
    super(resolves);
  }

  /** инициализация выполняется классом server */
  init(server: BusBunServer<JWT_P>): void {
    super.init(server);
    this.getBus().init(this);
  }

  stop(): void {
    super.stop();
    this.getBus().stop();
  }

  getBus(): Bus {
    return this.resolves.bus;
  }
}
