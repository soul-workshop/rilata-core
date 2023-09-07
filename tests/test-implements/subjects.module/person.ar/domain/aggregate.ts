import { AggregateRoot } from '../../../../../src/domain/domain-object/aggregate-root';
import { PersonMeta, PersonParams } from '../domain-data/person-params';

export class PersonAR extends AggregateRoot<PersonParams> {
  protected getMeta(): PersonMeta {
    return {
      name: 'PersonAR',
    };
  }

  getShortName(): string {
    const patronomic = this.attrs.patronomic ? ` ${this.attrs.patronomic[0].toUpperCase()}` : '';
    return `${this.attrs.lastName} ${this.attrs.name[0].toUpperCase()}${patronomic}`;
  }
}
