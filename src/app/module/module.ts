import { Logger } from '../../common/logger/logger';
import { ModuleResolver } from '../resolves/module-resolver';
import { GeneralCommandUseCase, GeneraQuerylUseCase } from '../use-case/types';
import { UseCase } from '../use-case/use-case';
import { ModuleType } from './types';

export abstract class Module<M_TYPE extends ModuleType> {
  readonly abstract moduleType: M_TYPE;

  readonly abstract moduleName: string;

  readonly abstract queryUseCases: GeneraQuerylUseCase[]

  readonly abstract commandUseCases: GeneralCommandUseCase[];

  protected moduleResolver!: ModuleResolver;

  protected useCases!: UseCase[];

  protected logger!: Logger;

  init(moduleResolver: ModuleResolver): void {
    this.moduleResolver = moduleResolver;
    this.logger = moduleResolver.getLogger();
    this.useCases = [...this.queryUseCases, ...this.commandUseCases];
    this.useCases.forEach((useCase) => useCase.init(moduleResolver));
  }

  getUseCaseByName(name: string): UseCase {
    const useCase = this.useCases.find((uc) => uc.getName() === name);
    if (useCase === undefined) {
      this.logger.error(
        `not finded in module "${this.moduleName}" usecase by name "${name}"`,
        { useCaseNames: this.useCases.map((uc) => uc.getName()) },
      );
    }
    return useCase;
  }

  getLogger(): Logger {
    return this.logger;
  }
}
