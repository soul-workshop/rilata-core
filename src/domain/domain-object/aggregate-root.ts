import { Logger } from '../../common/logger/logger';
import { GetArrayType } from '../../common/type-functions';
import { DomainObjectData } from '../domain-object-data/types';
import { GeneralAggregateRootParams } from './types';

/** Корневой объект - т.е имеет уникальную глобальную идентификацию */
export abstract class AggregateRoot<PARAMS extends GeneralAggregateRootParams> {
  protected abstract getMeta(): PARAMS['meta'];

  /** Коротктое доменное имя объекта.
    Обычно используется для идентификации пользователем объекта в списке */
  abstract getShortName(): string;

  protected logger!: Logger;

  private domainEvents: PARAMS['events'] = [];

  constructor(protected attrs: PARAMS['attrs'], protected version: number) {}

  init(logger: Logger): void {
    this.logger = logger;
  }

  getId(): string {
    return this.attrs.id;
  }

  getOutput(): DomainObjectData<PARAMS['attrs'], PARAMS['meta']> {
    return {
      attrs: this.attrs,
      meta: this.getMeta(),
    };
  }

  getVersion(): number {
    return this.version;
  }

  /** Обычно используется для логирования, например в ошибках. */
  toString(): string {
    return `${this.constructor.name} aggregate root: id-${this.getId()}`;
  }

  registerDomainEvent(event: GetArrayType<PARAMS['events']>): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): PARAMS['events'] {
    return this.domainEvents;
  }

  cleanDomainEvents(): void {
    this.domainEvents = [];
  }
}
