import { GeneralARDParams } from '../domain-object-data/aggregate-types';
import { DTO } from '../dto';
import { AggregateRoot } from './aggregate-root';
import { GeneralAR } from './types';

export abstract class AggregateFactory<PARAMS extends GeneralARDParams> {
  abstract aggregateCtor: typeof AggregateRoot<PARAMS>

  /** создать экземпляр агрегата по событию */
  abstract create(command: DTO): AggregateRoot<PARAMS>

  abstract restore(...args: unknown[]): GeneralAR
}
