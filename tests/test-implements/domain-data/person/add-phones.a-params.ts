import { ActionParams } from '../../../../src/domain/domain-object-data/aggregate-data-types';
import { EventDod } from '../../../../src/domain/domain-object-data/common-types';
import { PersonAttrs, PhoneAttrs } from './params';

export type AddingPhonesDomainCommand = {
  phones: PhoneAttrs[],
};

type PersonPhonesAddedEventAttrs = {
  addedPhones: PhoneAttrs[],
  aRoot: PersonAttrs,
}

export type PersonPhonesAddedEvent = EventDod<PersonPhonesAddedEventAttrs, 'PersonPhoneAddedEvent'>;

export type AddPhoneActionParams = ActionParams<
  'addPhone', 'instance', AddingPhonesDomainCommand, never, PersonPhonesAddedEvent[]
>
