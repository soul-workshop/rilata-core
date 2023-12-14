import { Logger } from '../../common/logger/logger';
import { ModuleResolver } from '../../conf/module-resolver';
import { GeneralARDParams } from '../../domain/domain-object-data/aggregate-data-types';
import { GeneralCommandUseCase, GeneraQuerylUseCase } from '../use-case/types';
import { UseCase } from '../use-case/use-case';
import { ModuleType } from './types';

export abstract class Module<M_TYPE extends ModuleType> {
  readonly abstract moduleType: M_TYPE;

  readonly abstract moduleName: string;

  readonly abstract queryUseCases: GeneraQuerylUseCase[]

  readonly abstract commandUseCases: GeneralCommandUseCase[];

  protected moduleResolver!: ModuleResolver;

  protected useCases!: UseCase<GeneralARDParams>[];

  protected logger!: Logger;

  init(moduleResolver: ModuleResolver): void {
    this.moduleResolver = moduleResolver;
    this.logger = moduleResolver.getLogger();
    this.useCases = [...this.queryUseCases, ...this.commandUseCases];
    this.useCases.forEach((useCase) => useCase.init(moduleResolver));
  }

  getUseCaseByActionName(actionDodName: string): UseCase<GeneralARDParams> {
    const useCase = this.useCases.find((uc) => uc.getName() === actionDodName);
    if (useCase === undefined) {
      this.logger.error(
        `not finded in module "${this.moduleName}" usecase by name "${actionDodName}"`,
        { useCaseNames: this.useCases.map((uc) => uc.getName()) },
      );
    }
    return useCase;
  }
}
