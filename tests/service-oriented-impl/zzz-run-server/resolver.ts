import { TokenVerifier } from '../../../src/app/jwt/jwt-verifier';
import { ServerResolver } from '../../../src/app/server/server-resolver';
import { ServerConfig } from '../../../src/app/server/types';
import { RunMode } from '../../../src/app/types';
import { ConsoleLogger } from '../../../src/common/logger/console-logger';
import { Logger } from '../../../src/common/logger/logger';
import { UuidType } from '../../../src/common/types';
import { FakeClassImplements } from '../../fixtures/fake-class-implements';

const serverConfig: ServerConfig = { hostname: 'localhost', port: 3000, loggerModes: 'all' as const };

export class ServiceModulesResolver extends ServerResolver {
  private logger = new ConsoleLogger(serverConfig.loggerModes);

  private tokenFerivier = new FakeClassImplements.TestTokenVerifier();

  getServerConfig(): ServerConfig {
    return serverConfig;
  }

  getLogger(): Logger {
    return this.logger;
  }

  getTokenVerifier(): TokenVerifier<{ userId: UuidType }> {
    return this.tokenFerivier;
  }

  getRunMode(): RunMode {
    return 'test';
  }
}
