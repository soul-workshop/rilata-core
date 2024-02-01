import { DTO } from '../../src/domain/dto';
import { TokenVerifier } from '../../src/app/jwt/token-verifier.interface';
import { Module } from '../../src/app/module/module';
import { RunMode } from '../../src/app/types';
import { ModuleResolver } from '../../src/app/resolves/module-resolver';
import { Logger } from '../../src/common/logger/logger';
import { ConsoleLogger } from '../../src/common/logger/console-logger';
import { Database } from '../../src/app/database/database';

export class TestResolverMock implements ModuleResolver {
  init(module: Module): void {
    throw new Error('Method not implemented.');
  }

  getTokenVerifier(): TokenVerifier<DTO> {
    throw new Error('Method not implemented.');
  }

  getRunMode(): RunMode {
    return 'test';
  }

  getModule(): Module {
    throw new Error('Method not implemented.');
  }

  getDatabase(): Database {
    throw new Error('Method not implemented.');
  }

  getLogger(): Logger {
    return new ConsoleLogger();
  }

  getRealisation(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }

  getRepository(repoKey: unknown): unknown {
    throw new Error('Method not implemented.');
  }
}

export const resolver = new TestResolverMock();
