import { BusServerResolver } from '../../../src/app/server/bus-server-resolver';
import { serverResolves } from './resolves';
import { BusRunServer } from './server';

export function main(): void {
  const server = new BusRunServer('all', 'test');
  const resolver = new BusServerResolver(serverResolves);
  server.init(resolver);
  server.run();
}

main();
