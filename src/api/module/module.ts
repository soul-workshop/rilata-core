/* eslint-disable no-use-before-define */
import { Logger } from '../../core/logger/logger.js';
import { Service } from '../service/service.js';
import { GeneralModuleResolver, ModuleType } from './types.js';
import { GeneralServerResolver } from '../server/types.js';
import { Controller } from '#api/controller/controller.js';
import { AssertionException } from '#core/exeptions.js';
import { ModuleController } from '#api/controller/m-controller.js';

export abstract class Module {
  readonly abstract moduleName: string;

  readonly abstract moduleType: ModuleType;

  protected abstract services: Service<GeneralModuleResolver>[];

  protected abstract moduleController: ModuleController;

  protected moduleResolver!: GeneralModuleResolver;

  protected logger!: Logger;

  abstract executeService(...args: unknown[]): Promise<unknown>

  init(
    moduleResolver: GeneralModuleResolver,
    serverResolver: GeneralServerResolver,
  ): void {
    this.moduleResolver = moduleResolver;
    moduleResolver.init(this, serverResolver);
    this.logger = moduleResolver.getLogger();
    this.logger.info(`  | resolver for module ${this.moduleName} inited successfully`);

    this.getModuleController().init(moduleResolver);
  }

  stop(): void {
    this.moduleResolver.stop();
  }

  getModuleController(): Controller<GeneralModuleResolver> {
    return this.moduleController;
  }

  getModuleResolver(): GeneralModuleResolver {
    return this.moduleResolver;
  }

  getLogger(): Logger {
    return this.logger;
  }

  getServises(): Service<GeneralModuleResolver>[] {
    return this.services;
  }

  getService<S extends Service<GeneralModuleResolver>>(handleName: S['handleName']): S {
    const service = this.services.find((s) => s.handleName === handleName);
    if (!service) {
      const errStr = `Не найден обработчик для запроса ${handleName} в модуле ${this.moduleName}`;
      this.logger.warning(errStr);
      throw new AssertionException(errStr);
    }
    return service as S;
  }
}
