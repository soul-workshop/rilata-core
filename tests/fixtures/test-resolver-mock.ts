import { Module } from '../../src/app/module/module';
import { ModuleResolver } from '../../src/app/module/module-resolver';
import { ModuleConfig, ModuleType } from '../../src/app/module/types';
import { ServerResolver } from '../../src/app/server/server-resolver';
import { Bus } from '../../src/app/bus/bus';
import { TokenVerifier } from '../../src/app/jwt/token-verifier.interface';
import { RunMode } from '../../src/app/types';
import { ConsoleLogger } from '../../src/common/logger/console-logger';
import { DTO } from '../../src/domain/dto';
import { Logger } from '../../src/common/logger/logger';
import { GeneraQueryService, GeneralCommandService, GeneralEventService } from '../../src/app/service/types';
import { ModuleResolves } from '../../src/app/module/module-resolves';
import { ModuleResolveInstance } from '../../src/app/resolves/types';

export class TestServerResolverMock extends ServerResolver {
  init(): void {
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

export class TestModuleResolverMock extends ModuleResolver<Module, ModuleResolves<Module>> {
  protected moduleConfig: ModuleConfig = {
    ModuleUrl: 'some-url-path',
  };

  getFacade(...args: unknown[]): ModuleResolveInstance {
    throw new Error('Method not implemented.');
  }

  getRealisation(...args: unknown[]): ModuleResolveInstance {
    throw new Error('Method not implemented.');
  }

  getRepository(...args: unknown[]): ModuleResolveInstance {
    throw new Error('Method not implemented.');
  }
}

export class TestModuleMock extends Module {
  moduleType: ModuleType = 'read-module';

  moduleName = 'test-module';

  queryServices: GeneraQueryService[] = [];

  commandServices: GeneralCommandService[] = [];

  eventServices: GeneralEventService[] = [];
}

export const testServerResolverMock = new TestServerResolverMock();

export const testmoduleResolverMock = new TestModuleResolverMock(
  {} as ModuleResolves<Module>,
);

export const testModuleMock = new TestModuleMock();

testModuleMock.init(testmoduleResolverMock, testServerResolverMock);
