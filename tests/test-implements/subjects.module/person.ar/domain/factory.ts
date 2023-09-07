import { AggregateFactory } from '../../../../../src/domain/domain-object/aggregate-factory';
import { GeneralAR } from '../../../../../src/domain/domain-object/types';
import { AddingPersonDomainCommand, PersonAddedEvent, PersonParams } from '../domain-data/person-params';
import { PersonAR } from './aggregate';

export class PersonArFactory extends AggregateFactory<PersonParams> {
  aggregateCtor = PersonAR;

  create(command: AddingPersonDomainCommand): PersonAR {
    const personAttrs = {
      id: crypto.randomUUID(),
      ...command.attrs,
    };
    const person = new PersonAR(personAttrs, 0);
    person.init(this.logger);

    const personAddedEvent: PersonAddedEvent = {
      name: 'PersonAddedEvent',
      attrs: personAttrs,
      domainType: 'event',
      eventId: crypto.randomUUID(),
    };
    person.registerDomainEvent(personAddedEvent);

    return person;
  }

  restore(...args: unknown[]): GeneralAR {
    throw new Error('Method not implemented.');
  }
}
