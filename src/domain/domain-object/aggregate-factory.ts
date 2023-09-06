import { Logger } from '../../common/logger/logger';
import { DTO } from '../dto';
import { AggregateRoot } from './aggregate-root';
import { GeneralAggregateRoot, GeneralAggregateRootParams } from './types';

export abstract class AggregateFactory<PARAMS extends GeneralAggregateRootParams> {
  abstract aggregateCtor: typeof AggregateRoot<PARAMS>

  protected logger!: Logger;

  init(logger: Logger): void {
    this.logger = logger;
  }

  /** создать экземпляр агрегата по событию */
  abstract create(command: DTO): AggregateRoot<PARAMS>

  abstract restore(...args: unknown[]): GeneralAggregateRoot
}
