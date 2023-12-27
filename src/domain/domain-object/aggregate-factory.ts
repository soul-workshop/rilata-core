import { Caller } from '../../app/caller';
import { Logger } from '../../common/logger/logger';
import { GeneralARDParams } from '../domain-data/params-types';
import { DTO } from '../dto';
import { AggregateRoot } from './aggregate-root';

export abstract class AggregateFactory<PARAMS extends GeneralARDParams> {
  constructor(protected logger: Logger) {}

  /** создать экземпляр агрегата по событию */
  abstract create(caller: Caller, command: DTO): AggregateRoot<PARAMS>

  /** восстановить эксемпляр агрегата по атрибутам */
  abstract restore(...args: unknown[]): AggregateRoot<PARAMS>
}
