import { UuidType } from '../../../../../src/common/types';
import { ActionParams } from '../../../../../src/domain/domain-data/params-types';
import { EventDod } from '../../../../../src/domain/domain-data/domain-types';
import { AllowedOnlyEmployeerError, AllowedOnlyStaffManagersError } from '../company/role-errors';
import { PhoneAttrs } from './params';

export type AddPhonesActionDod = {
  actionName: 'AddPhone',
  requestId: UuidType,
  phones: PhoneAttrs[],
};

type PersonPhonesAddedEventAttrs = PhoneAttrs[]

export type PersonPhonesAddedEvent = EventDod<PersonPhonesAddedEventAttrs, 'PersonPhoneAddedEvent'>;

export type AddPhoneActionParams = ActionParams<
  AddPhonesActionDod,
  undefined,
  AllowedOnlyEmployeerError | AllowedOnlyStaffManagersError,
  PersonPhonesAddedEvent[]
>
