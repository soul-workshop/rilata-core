import { uuidUtility } from '../../../../../src/common/utils/uuid/uuid-utility';
import { AggregateFactory } from '../../../../../src/domain/domain-object/aggregate-factory';
import { AddingPersonActionAttrs } from '../../domain-data/person/add-person/a-params';
import { PersonAttrs, PersonParams } from '../../domain-data/person/params';
import { PersonAR } from './a-root';

export class PersonFactory extends AggregateFactory<PersonParams> {
  create(actionAttrs: AddingPersonActionAttrs): PersonAR {
    const personAttrs: PersonAttrs = {
      ...actionAttrs,
      id: uuidUtility.getNewUUID(),
      contacts: { phones: [] },
    };
    const person = new PersonAR(personAttrs, 0, this.logger);

    person.getHelper().registerEvent('PersonAddedEvent', personAttrs);
    return person;
  }

  restore(attrs: PersonAttrs, version: number): PersonAR {
    return new PersonAR(attrs, version, this.logger);
  }
}
