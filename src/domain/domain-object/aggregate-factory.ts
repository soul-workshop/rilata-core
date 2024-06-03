import { DTO } from '../dto';
import { GeneralArParams } from '../index';
import { AggregateRoot } from './aggregate-root';

export abstract class AggregateFactory<PARAMS extends GeneralArParams> {
  /** создать экземпляр агрегата по событию */
  abstract create(command: DTO, ...attrs: unknown[]): AggregateRoot<PARAMS>

  /** восстановить эксемпляр агрегата по атрибутам */
  abstract restore(...args: unknown[]): AggregateRoot<PARAMS>
}
