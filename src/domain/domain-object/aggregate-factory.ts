import { Caller } from '../../app/caller';
import { ModuleResolver } from '../../app/resolves/module-resolver';
import { GeneralARDParams } from '../domain-object-data/aggregate-data-types';
import { DTO } from '../dto';
import { AggregateRoot } from './aggregate-root';

export abstract class AggregateFactory<PARAMS extends GeneralARDParams> {
  constructor(protected resolver: ModuleResolver) {}

  /** создать экземпляр агрегата по событию */
  abstract create(caller: Caller, command: DTO): AggregateRoot<PARAMS>

  /** восстановить эксемпляр агрегата по атрибутам */
  abstract restore(...args: unknown[]): AggregateRoot<PARAMS>
}
