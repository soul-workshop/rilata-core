import { ActionParams } from '../../../../../src/domain/domain-object-data/aggregate-data-types';
import { EventDod } from '../../../../../src/domain/domain-object-data/common-types';
import { AllowedOnlyEmployeerError, AllowedOnlyStaffManagersError } from '../company/role-errors';
import { PersonAttrs, PhoneAttrs } from './params';

export type AddPhonesDomainCommand = {
  phones: PhoneAttrs[],
};

type PersonPhonesAddedEventAttrs = {
  addedPhones: PhoneAttrs[],
  aRoot: PersonAttrs,
}

export type PersonPhonesAddedEvent = EventDod<PersonPhonesAddedEventAttrs, 'PersonPhoneAddedEvent'>;

export type AddPhoneActionParams = ActionParams<
  AddPhonesDomainCommand,
  undefined,
  AllowedOnlyEmployeerError | AllowedOnlyStaffManagersError,
  PersonPhonesAddedEvent[]
>
