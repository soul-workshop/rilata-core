import { BusRunServerResolver } from './resolver';
import { BusRunServer } from './server';

export namespace BusRunFixtures {
  export async function getServer(): Promise<BusRunServer> {
    const server = new BusRunServer('all', 'test');
    const serverResolver = new BusRunServerResolver();
    server.init(serverResolver);
    return server;
  }
}
