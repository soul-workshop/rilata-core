import { AggregateRoot } from '../../../../../src/domain/domain-object/aggregate-root';
import { AddPhonesDomainCommand, PersonPhonesAddedEvent } from '../../domain-data/person/add-phones.a-params';
import { PersonAttrs, PersonMeta, PersonParams } from '../../domain-data/person/params';

export class Person extends AggregateRoot<PersonParams> {
  constructor(protected attrs: PersonAttrs, protected version: number) {
    super();
  }

  protected getMeta(): PersonMeta {
    return {
      name: 'PersonAR',
      domainType: 'domain-object',
      objectType: 'aggregate',
    };
  }

  /** возвращает в формате Иванов И. И. */
  getShortName(): string {
    const patronomic = this.attrs.patronomic && this.attrs.patronomic.length > 0
      ? ` ${this.attrs.patronomic[0].toUpperCase}.`
      : '';
    return `${this.attrs.lastName} ${this.attrs.name[0].toUpperCase}.${patronomic}`;
  }

  addPhone(userId: string, addPhone: AddPhonesDomainCommand): void {
    const event: PersonPhonesAddedEvent = {

    }
  }
}
