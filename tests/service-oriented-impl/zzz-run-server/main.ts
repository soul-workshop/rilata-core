import { TestDatabase } from '../../../src/app/database/test-database';
import { BunServer } from '../../../src/app/server/bun-server';
import { RilataServer } from '../../../src/app/server/server';
import { ServerResolver } from '../../../src/app/server/server-resolver';
import { UserJwtPayload } from '../auth/services/user/user-authentification/s-params';
import { serverStarter } from './starter';
import { ServiceModulesFixtures } from './server-fixtures';

function parseArgs<JWT_P extends UserJwtPayload>(
  server: RilataServer<JWT_P>, resolver: ServerResolver<JWT_P>,
): void {
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
  const server = serverStarter.start('all') as BunServer<UserJwtPayload>;
  parseArgs(server, server.getServerResolver());
  server.run();
}

main();
