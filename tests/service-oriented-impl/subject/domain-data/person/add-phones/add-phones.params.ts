import { EventDod } from '../../../../../../src/domain/domain-data/domain-types';
import { PersonOutARDT, PhoneAttrs } from '../params';

export type AddPhonesActionDod = { phones: PhoneAttrs[] };

export type PersonPhonesAddedEvent = EventDod<
  'PersonPhoneAddedEvent', 'AddingPhoneService', 'SubjectModule', AddPhonesActionDod, PersonOutARDT
>;
