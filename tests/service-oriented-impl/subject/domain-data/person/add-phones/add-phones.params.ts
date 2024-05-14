import { EventDod } from '../../../../../../src/domain/domain-data/domain-types';
import { ActionParams } from '../../../../../../src/domain/domain-data/params-types';
import { PersonARDT, PhoneAttrs } from '../params';

export type AddPhonesActionDod = { phones: PhoneAttrs[] };

type PersonPhonesAddedEventAttrs = PhoneAttrs[]

export type PersonPhonesAddedEvent = EventDod<
  'PersonPhoneAddedEvent', 'AddingPhoneService', 'SubjectModule', PersonPhonesAddedEventAttrs, PersonARDT
>;

export type AddPhoneActionParams = ActionParams<
  AddPhonesActionDod,
  undefined,
  never,
  PersonPhonesAddedEvent[]
>
