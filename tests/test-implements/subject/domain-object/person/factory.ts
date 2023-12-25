import { Caller } from '../../../../../src/app/caller';
import { dodUtility } from '../../../../../src/common/utils/domain-object/dod-utility';
import { uuidUtility } from '../../../../../src/common/utils/uuid/uuid-utility';
import { AggregateFactory } from '../../../../../src/domain/domain-object/aggregate-factory';
import { AddPersonActionDod } from '../../cm-use-case/adding-person/params';
import { PersonAddedEvent } from '../../domain-data/person/add-person.params';
import { PersonAttrs, PersonParams } from '../../domain-data/person/params';
import { PersonAR } from './a-root';

export class PersonFactory extends AggregateFactory<PersonParams> {
  create(caller: Caller, actionDod: AddPersonActionDod): PersonAR {
    const personAttrs: PersonAttrs = {
      ...actionDod.body,
      id: uuidUtility.getNewUUID(),
      contacts: { phones: [] },
    };
    const person = new PersonAR(personAttrs, 0, this.resolver.getLogger());
    const event = dodUtility.getEventByType<PersonAddedEvent>(
      'PersonAddedEvent',
      { aRoot: personAttrs },
      caller,
    );
    person.getHelper().registerDomainEvent(event);
    return person;
  }

  restore(attrs: PersonAttrs, version: number): PersonAR {
    return new PersonAR(attrs, version, this.resolver.getLogger());
  }
}
