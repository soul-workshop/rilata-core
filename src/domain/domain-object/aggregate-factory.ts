import { Caller } from '../../app/caller';
import { GeneralARDParams } from '../domain-object-data/aggregate-data-types';
import { DTO } from '../dto';
import { AggregateRoot } from './aggregate-root';
import { GeneralAR } from './types';

export abstract class AggregateFactory<PARAMS extends GeneralARDParams> {
  /** создать экземпляр агрегата по событию */
  abstract create(caller: Caller, command: DTO): AggregateRoot<PARAMS>

  abstract restore(...args: unknown[]): GeneralAR
}
