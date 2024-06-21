/* eslint-disable no-use-before-define */
import { Logger } from '../../core/logger/logger.js';
import { Service } from '../service/service.js';
import { GeneralModuleResolver, ModuleType } from './types.js';
import { failure } from '../../core/result/failure.js';
import { Locale } from '../../domain/locale.js';
import { BadRequestError } from '../service/error-types.js';
import { Result } from '../../core/result/types.js';
import { GeneralServerResolver } from '../server/types.js';
import { Caller } from '../controller/types.js';
import { dodUtility } from '../../core/utils/dod/dod-utility.js';
import { Controller } from '#api/controller/controller.js';
import { badRequestError } from '#api/base.index.js';

export abstract class Module {
  readonly abstract moduleName: string;

  readonly abstract moduleType: ModuleType;

  protected abstract services: Service<GeneralModuleResolver>[];

  protected abstract moduleController: Controller<GeneralModuleResolver>;

  protected moduleResolver!: GeneralModuleResolver;

  protected logger!: Logger;

  abstract executeService(input: unknown, caller: Caller): Promise<unknown>

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

  protected notFindedServiceError(errString: string): Result<typeof badRequestError, never> {
    const err = dodUtility.getAppError<BadRequestError<Locale<'Bad request'>>>(
      'Bad request', errString, {},
    );
    return failure(err);
  }
}
