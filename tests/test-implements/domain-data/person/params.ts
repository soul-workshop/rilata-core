import { Caller } from '../../../../src/app/caller';
import { ActionParams, AggregateRootDataParams } from '../../../../src/domain/domain-object-data/aggregate-data-types';
import { ErrorDod, EventDod } from '../../../../src/domain/domain-object-data/common-types';

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

export type PersonDoesNotExistsError = ErrorDod<
  {text: 'Человек с данным ИИН уже добавлен в систему', hint: Record<never, unknown>},
  'PersonExistsError'
>;

export type PersonMeta = {
  name: 'PersonAR',
}

export type PersonAddedEvent = EventDod<PersonAttrs, 'PersonAddedEvent'>;

export type PersonEvents = [PersonAddedEvent];

export type AddPersonActionParams = ActionParams<
  'addPerson', 'class', AddingPersonDomainCommand, PersonDoesNotExistsError, PersonAddedEvent
>

export type PersonParams = AggregateRootDataParams<
  PersonAttrs, PersonMeta, AddPersonActionParams
>;
