import { QueryServiceParams } from '../../../../../../src/app/service/types';
import { RequestDod } from '../../../../../../src/domain/domain-data/domain-types';
import { PersonOutAttrs, PersonParams } from '../../../domain-data/person/params';
import { PersonDoesntExistByIinError } from '../../../domain-object/person/repo-errors';

export type GetPersonByIinRequestDodAttrs = {
  iin: string,
}

export type GetPersonByIinRequestDod = RequestDod<'getPersonByIin', GetPersonByIinRequestDodAttrs>

export type GetPersonByIinOut = PersonOutAttrs

export type GetPersonByIinServiceParams = QueryServiceParams<
  PersonParams,
  GetPersonByIinRequestDod,
  GetPersonByIinOut,
  PersonDoesntExistByIinError
>
