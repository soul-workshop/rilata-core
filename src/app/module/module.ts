import { Logger } from '../../common/logger/logger';
import { GetARParamsActionNames } from '../../domain/domain-object-data/type-functions';
import { AggregateRoot } from '../../domain/domain-object/aggregate-root';
import { GetARParams } from '../../domain/domain-object/types';
import { GeneralUseCase } from '../use-case/types';

export abstract class Module {
  abstract getName(): string;

  abstract useCases: GeneralUseCase[];

  protected logger!: Logger;

  init(logger: Logger): void {
    this.logger = logger;
  }

  getUseCase<T extends typeof AggregateRoot, IT extends InstanceType<T>>(
    AggRootCtor: T,
    name: GetARParamsActionNames<GetARParams<IT>>,
  ): IT {
    const finded = this.useCases.find((useCase) => useCase.actionName, name);
    if (finded === undefined) this.logger.error(`not finded usecase by name ${name}`);
    if (!(finded instanceof AggRootCtor)) {
      this.logger.error(`${finded.constructor.name} is not instance of ${AggRootCtor.name}`);
    }
    return finded as IT;
  }
}
