import { Logger } from '../../common/logger/logger';
import { GeneralAggregateRootParams } from '../../domain/domain-object/types';
import { ClassActionable } from '../use-case/actionable/class-actionable';
import { InstanceActionable } from '../use-case/actionable/instance-actionable';
import { GeneralClassActionable, GeneralInstanceActionable } from '../use-case/actionable/types';

export abstract class Module {
  abstract getName(): string;

  abstract classUseCases: GeneralClassActionable[];

  abstract instanceUseCases: GeneralInstanceActionable[];

  protected logger!: Logger;

  init(logger: Logger): void {
    this.logger = logger;
  }

  getClassUseCase<N extends string>(
    useCaseName: N,
  ): ClassActionable<GeneralAggregateRootParams, N> {
    const finded = this.classUseCases.find((useCase) => useCase.getActionName() === useCaseName);
    if (finded === undefined) this.logger.error(`not finded useCase by name: ${useCaseName}`);
    return finded as ClassActionable<GeneralAggregateRootParams, N>;
  }

  getInstanceUseCases<N extends string>(
    useCaseName: N,
  ): InstanceActionable<GeneralAggregateRootParams, N> {
    const finded = this.instanceUseCases.find((useCase) => useCase.getActionName() === useCaseName);
    if (finded === undefined) this.logger.error(`not finded useCase by name: ${useCaseName}`);
    return finded as InstanceActionable<GeneralAggregateRootParams, N>;
  }

  getUseCase(name: string): UseCas
}
