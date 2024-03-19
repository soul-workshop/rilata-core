import { BusServerResolver } from '../../../src/app/server/bus-server-resolver';
import { serverResolves } from './resolves';
import { BusRunServer } from './server';

export namespace BusRunFixtures {
  export async function getServer(): Promise<BusRunServer> {
    const server = new BusRunServer('all', 'test');
    const serverResolver = new BusServerResolver(serverResolves);
    server.init(serverResolver);
    return server;
  }
}
