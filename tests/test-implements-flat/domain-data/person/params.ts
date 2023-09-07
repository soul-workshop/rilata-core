import { Caller } from '../../../../../src/app/caller';
import { ErrorDod, EventDod } from '../../../../../src/domain/domain-object-data/types';
import { AggregateRootParams } from '../../../../../src/domain/domain-object/types';

export type PersonAttrs = {
  id: string,
  govPersonId: string,
  name: string,
  lastName: string,
  patronomic?: string,
}

export type PersonClassActions = 'addPerson';

export type PersonInstanceActions = never;

export type AddingPersonDomainCommand = Omit<PersonAttrs, 'id'>;

export type AddingPersonOptions = {
  in: AddingPersonDomainCommand,
  caller: Caller,
}

export type PersonExistsError = ErrorDod<
  {text: 'Человек с данным ИИН уже добавлен в систему', hint: Record<never, unknown>},
  'PersonExistsError'
>;

export type PersonMeta = {
  name: 'PersonAR',
}

export type PersonAddedEvent = EventDod<PersonAttrs, 'PersonAddedEvent'>;

export type PersonEvents = [PersonAddedEvent];

export type PersonParams = AggregateRootParams<
  PersonAttrs, PersonMeta, PersonClassActions, PersonInstanceActions, PersonEvents
>;
