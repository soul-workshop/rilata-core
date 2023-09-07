import { Logger } from '../../common/logger/logger';
import { GeneralARDParams } from '../../domain/domain-object-data/aggregate-data-types';
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
    actionName: N,
  ): ClassActionable<GeneralARDParams, N> {
    const finded = this.classUseCases.find((useCase) => useCase.actionName === actionName);
    if (finded === undefined) this.logger.error(`not finded useCase by name: ${actionName}`);
    return finded as ClassActionable<GeneralARDParams, N>;
  }

  getInstanceUseCases<N extends string>(
    actionName: N,
  ): InstanceActionable<GeneralARDParams, N> {
    const finded = this.instanceUseCases.find((useCase) => useCase.actionName === actionName);
    if (finded === undefined) this.logger.error(`not finded useCase by name: ${actionName}`);
    return finded as InstanceActionable<GeneralARDParams, N>;
  }

  getUseCase
}
