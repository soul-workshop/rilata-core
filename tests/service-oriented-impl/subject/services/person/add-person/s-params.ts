import { CommandServiceParams } from '../../../../../../src/app/service/types';
import { UuidType } from '../../../../../../src/common/types';
import { RequestDod, EventDod } from '../../../../../../src/domain/domain-data/domain-types';
import { AddingPersonActionAttrs } from '../../../domain-data/person/add-person/a-params';
import { PersonARDT, PersonParams } from '../../../domain-data/person/params';
import { PersonAlreadyExistsError } from '../../../domain-object/person/repo-errors';

export type AddPersonRequestDodAttrs = AddingPersonActionAttrs

export type AddPersonRequestDod = RequestDod<AddPersonRequestDodAttrs, 'addPerson'>

export type AddPersonOut = { id: UuidType }

export type AddPersonEvent = EventDod<
  AddPersonRequestDodAttrs,
  'PersonAddedEvent',
  PersonARDT
>

export type AddPersonServiceParams = CommandServiceParams<
  PersonParams,
  AddPersonRequestDod,
  AddPersonOut,
  PersonAlreadyExistsError,
  AddPersonEvent[]
>
