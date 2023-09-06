import { AggregateFactory } from '../../../../../src/domain/domain-object/aggregate-factory';
import { GeneralAggregateRoot } from '../../../../../src/domain/domain-object/types';
import { PersonParams } from '../object-data/person-params';
import { AddingPersonCommand, PersonAddedEvent } from '../use-cases/adding-person/use-case-params';
import { PersonAR } from './aggregate';

export class PersonArFactory extends AggregateFactory<PersonParams> {
  aggregateCtor = PersonAR;

  create(command: AddingPersonCommand): PersonAR {
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

  restore(...args: unknown[]): GeneralAggregateRoot {
    throw new Error('Method not implemented.');
  }
}
