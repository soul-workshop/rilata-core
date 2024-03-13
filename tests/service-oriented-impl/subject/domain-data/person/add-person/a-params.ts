import { EventDod } from '../../../../../../src/domain/domain-data/domain-types';
import { ActionParams, DomainResult } from '../../../../../../src/domain/domain-data/params-types';
import { PersonARDT, PersonAttrs } from '../params';

export type AddingPersonActionAttrs = Omit<PersonAttrs, 'id' | 'contacts'>;

export type PersonAddedEvent = EventDod<PersonAttrs, 'PersonAddedEvent', PersonARDT>;

export type AddPersonActionParams = ActionParams<
  AddingPersonActionAttrs,
  undefined,
  never,
  PersonAddedEvent[]
>

export type AddPersonResult = DomainResult<AddPersonActionParams>;
