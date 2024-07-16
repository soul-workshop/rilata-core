import { GeneralArParams } from '#domain/domain-data/domain-types.js';
import { DTO } from '../dto.js';
import { AggregateRoot } from './aggregate-root.js';

export abstract class AggregateFactory<PARAMS extends GeneralArParams> {
  /** создать экземпляр агрегата по событию */
  abstract create(command: DTO, ...attrs: unknown[]): AggregateRoot<PARAMS>

  /** восстановить эксемпляр агрегата по атрибутам */
  abstract restore(...args: unknown[]): AggregateRoot<PARAMS>
}
