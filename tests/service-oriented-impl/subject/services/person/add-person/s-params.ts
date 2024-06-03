import { CommandServiceParams } from '../../../../../../src/api/service/types';
import { UuidType } from '../../../../../../src/core/types';
import { RequestDod } from '../../../../../../src/domain/domain-data/domain-types';
import { AddingPersonActionAttrs, PersonAddedEvent } from '../../../domain-data/person/add-person/a-params';
import { PersonParams } from '../../../domain-data/person/params';
import { PersonAlreadyExistsError } from '../../../domain-object/person/repo-errors';

export type AddPersonRequestDodAttrs = AddingPersonActionAttrs

export type AddPersonRequestDod = RequestDod<'addPerson', AddPersonRequestDodAttrs>

export type AddPersonOut = { id: UuidType }

export type AddPersonServiceParams = CommandServiceParams<
  'AddingPersonService',
  PersonParams,
  AddPersonRequestDod,
  AddPersonOut,
  PersonAlreadyExistsError,
  PersonAddedEvent[]
>
