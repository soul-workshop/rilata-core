import { DomainAttrs } from '../domain-object-data/types';
import { GeneralAggregateRoot } from './types';

/** Доменный объект, обычно часть агрегата */
export abstract class DomainObject<ATTRS extends DomainAttrs> {
  constructor(protected attrs: ATTRS, protected aggregate: GeneralAggregateRoot) {}

  /** Коротктое доменное имя объекта.
    Обычно используется для идентификации пользователем объекта в списке */
  abstract getShortName(): string;

  /** Обычно используется для логирования, например в ошибках. */
  toString(): string {
    return `${this.constructor.name} domain object`;
  }
}
