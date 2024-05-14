import { Bus } from '../../../src/app/bus/bus';
import { BusServerResolver } from '../../../src/app/server/bus.s-resolver';
import { ServerResolver } from '../../../src/app/server/s-resolver';
import { BusServerResolves } from '../../../src/app/server/s-resolves';
import { RilataServer } from '../../../src/app/server/server';
import { UserJwtPayload } from '../types';

export class BusRunServerResolver extends ServerResolver<BusServerResolves<UserJwtPayload>>
  implements BusServerResolver {
  init(server: RilataServer): void {
    super.init(server);
    this.resolves.bus.init(this);
  }

  getBus(): Bus {
    return this.resolves.bus;
  }
}
