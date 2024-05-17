import { QueryServiceParams } from '../../../../../../src/app/service/types';
import { RequestDod } from '../../../../../../src/domain/domain-data/domain-types';
import { PersonAttrs, PersonParams } from '../../../domain-data/person/params';
import { PersonDoesntExistByIinError } from '../../../domain-object/person/repo-errors';

export type GetPersonByIinRequestDodAttrs = {
  iin: string,
}

export type GetPersonByIinRequestDod = RequestDod<'getPersonByIin', GetPersonByIinRequestDodAttrs>

export type GetPersonByIinOut = PersonAttrs

export type GetPersonByIinServiceParams = QueryServiceParams<
  'GetingPersonByIinService',
  PersonParams,
  GetPersonByIinRequestDod,
  GetPersonByIinOut,
  PersonDoesntExistByIinError
>
