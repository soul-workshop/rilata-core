import { TestDatabase } from '../../../src/app/database/test-database';
import { BunServer } from '../../../src/app/server/bun-server';
import { ServerResolver } from '../../../src/app/server/server-resolver';
import { BusRunServerResolver } from './resolver';
import { BusRunServer } from './server';
import { BusRunFixtures } from './server-fixtures';

function parseArgs(server: BunServer, resolver: ServerResolver): void {
  const [pathToBun, pathToTs, ...others] = Bun.argv;
  if (others.includes('-f') || others.includes('--fixtures')) {
    const modules = server.getModules();
    resolver.getLogger().info(
      `init test database fixtures for modules: ${modules.map((m) => m.moduleName).join('; ')}`,
    );
    modules.filter((m) => m.moduleName !== 'FrontProxyModule').forEach((module) => {
      const db = module.getModuleResolver().getDatabase() as TestDatabase;
      // db.addBatch(BusRunFixtures.repoFixtures);
    });
    resolver.getLogger().info('init test database fixtures finished');
  }
}

export function main(): void {
  const server = new BusRunServer('all', 'test');
  const resolver = new BusRunServerResolver();
  server.init(resolver);
  parseArgs(server, resolver);
  server.run();
}

main();
