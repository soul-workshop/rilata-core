import { EventDod } from '../../../../../../src/domain/domain-data/domain-types';
import { PersonAttrs, PersonOutARDT } from '../params';

export type AddingPersonActionAttrs = Omit<PersonAttrs, 'id' | 'contacts'>;

export type PersonAddedEvent = EventDod<
  'PersonAddedEvent', 'AddingPersonService', 'SubjectModule', PersonAttrs, PersonOutARDT
>;
