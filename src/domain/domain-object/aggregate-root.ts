import { AggregateRootDataTransfer, GeneralARDParams } from '../domain-object-data/aggregate-data-types';
import { GetARParamsEvents } from '../domain-object-data/type-functions';

/** Корневой объект - т.е имеет уникальную глобальную идентификацию */
export abstract class AggregateRoot<PARAMS extends GeneralARDParams> {
  protected abstract getMeta(): PARAMS['meta'];

  /** Коротктое доменное имя объекта.
    Обычно используется для идентификации пользователем объекта в списке */
  abstract getShortName(): string;

  protected abstract attrs: PARAMS['attrs'];

  protected abstract version: number;

  private domainEvents: GetARParamsEvents<PARAMS>[] = [];

  getId(): string {
    return this.attrs.id;
  }

  getOutput(): AggregateRootDataTransfer<PARAMS['attrs'], PARAMS['meta']> {
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

  registerDomainEvent(event: GetARParamsEvents<PARAMS>): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): GetARParamsEvents<PARAMS>[] {
    return this.domainEvents;
  }

  cleanDomainEvents(): void {
    this.domainEvents = [];
  }
}
