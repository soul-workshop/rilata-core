import { Logger } from '../../../../../src/common/logger/logger';
import { AggregateRootHelper } from '../../../../../src/domain/domain-object/aggregate-helper';
import { AggregateRoot } from '../../../../../src/domain/domain-object/aggregate-root';
import { PersonAttrs, PersonParams } from '../../domain-data/person/params';

export class PersonAR extends AggregateRoot<PersonParams> {
  protected helper: AggregateRootHelper<PersonParams>;

  constructor(protected attrs: PersonAttrs, version: number, logger: Logger) {
    super();
    this.helper = new AggregateRootHelper(
      'PersonAR', attrs, 'id', version, ['contacts.techSupportComments'], logger,
    );

    // process aggregate root invariants see CompanyAR
  }

  /** возвращает в формате Иванов И. И. */
  getShortName(): string {
    return `${this.attrs.lastName} ${this.attrs.firstName[0].toUpperCase}.`;
  }
}
