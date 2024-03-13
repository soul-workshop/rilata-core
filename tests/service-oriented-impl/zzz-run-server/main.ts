import { TestDatabase } from '../../../src/app/database/test-database';
import { BunServer } from '../../../src/app/server/bun-server';
import { ServerResolver } from '../../../src/app/server/server-resolver';
import { ServiceModulesResolver } from './resolver';
import { ServiceModulesBunServer } from './server';
import { ServiceModulesFixtures } from './server-fixtures';

function parseArgs(server: BunServer, resolver: ServerResolver): void {
  const [pathToBun, pathToTs, ...others] = Bun.argv;
  if (others.includes('-f') || others.includes('--fixtures')) {
    const modules = server.getModules();
    resolver.getLogger().info(
      `init test database fixtures for modules: ${modules.map((m) => m.moduleName).join('; ')}`,
    );
    modules.filter((m) => m.moduleName !== 'FrontProxyModule').forEach((module) => {
      const db = module.getModuleResolver().getDatabase() as TestDatabase;
      db.addBatch(ServiceModulesFixtures.repoFixtures);
    });
    resolver.getLogger().info('init test database fixtures finished');
  }
}

export function main(): void {
  const server = new ServiceModulesBunServer('all', 'test');
  const resolver = new ServiceModulesResolver();
  server.init(resolver);
  parseArgs(server, resolver);
  server.run();
}

main();
