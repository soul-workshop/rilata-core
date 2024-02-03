import { Module } from '../../src/app/module/module';
import { ModuleResolver } from '../../src/app/module/module-resolver';
import { Database } from '../../src/app/database/database';
import { DomainEventRepository } from '../../src/app/database/domain-event-repository';
import { EventDelivererWorkerProxy } from '../../src/app/event-deliverer/event-deliverer-worker';
import { ModuleConfig, ModuleType } from '../../src/app/module/types';
import { ServerResolver } from '../../src/app/server/server-resovler';
import { Bus } from '../../src/app/bus/bus';
import { TokenVerifier } from '../../src/app/jwt/token-verifier.interface';
import { RunMode } from '../../src/app/types';
import { ConsoleLogger } from '../../src/common/logger/console-logger';
import { DTO } from '../../src/domain/dto';
import { Logger } from '../../src/common/logger/logger';
import { GeneraQueryService, GeneralCommandService } from '../../src/app/service/types';

export class TestServerResolverMock extends ServerResolver {
  async init(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getServerConfig(): unknown {
    throw new Error('Method not implemented.');
  }

  getBus(): Bus {
    throw new Error('Method not implemented.');
  }

  getLogger(): Logger {
    return new ConsoleLogger();
  }

  getTokenVerifier(): TokenVerifier<DTO> {
    throw new Error('Method not implemented.');
  }

  getRunMode(): RunMode {
    return 'test';
  }
}

export class TestResolverMock extends ModuleResolver<Module> {
  get moduleConfig(): ModuleConfig {
    throw new Error('Method not implemented.');
  }

  getModuleConfig(): ModuleConfig {
    throw new Error('Method not implemented.');
  }

  getEventDelivererWorker(): EventDelivererWorkerProxy {
    throw new Error('Method not implemented.');
  }

  getDatabase(): Database {
    throw new Error('Method not implemented.');
  }

  getEventRepository(): DomainEventRepository {
    throw new Error('Method not implemented.');
  }

  getRealisation(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }

  getRepository(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }
}

export class TestModuleMock extends Module {
  moduleType: ModuleType = 'read-module';

  moduleName = 'test-module';

  queryServices: GeneraQueryService[] = [];

  commandServices: GeneralCommandService[] = [];
}

export const testServerResolverMock = new TestServerResolverMock();

export const testResolverMock = new TestResolverMock(testServerResolverMock);

export const testModuleMock = new TestModuleMock();

testResolverMock.init(testModuleMock);
testModuleMock.init(testResolverMock);
