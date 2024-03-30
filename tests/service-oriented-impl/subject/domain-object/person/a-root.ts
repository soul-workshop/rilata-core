import { Logger } from '../../../../../src/common/logger/logger';
import { AggregateRoot } from '../../../../../src/domain/domain-object/aggregate-root';
import { PersonAttrs, PersonParams } from '../../domain-data/person/params';
import { PersonInvariantsValidator } from '../../domain-data/person/v-map';

export class PersonAR extends AggregateRoot<PersonParams> {
  protected invariantsValidator = PersonInvariantsValidator;

  constructor(attrs: PersonAttrs, version: number, logger: Logger) {
    super(attrs, 'PersonAR', 'id', version, ['contacts.techSupportComments'], logger);
  }

  /** возвращает в формате Иванов И. И. */
  getShortName(): string {
    return `${this.attrs.lastName} ${this.attrs.firstName[0].toUpperCase}.`;
  }
}
