import { RequestDodValidator } from '../../../../../../src/app/service/types';
import { DtoFieldValidator } from '../../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../../src/domain/validator/field-validator/types';
import { personAttrsVMap } from '../../../domain-data/person/v-map';
import { GetPersonByIinRequestDodAttrs, GetPersonByIinServiceParams } from './s-params';

export const getPersonByIinVmap: ValidatorMap<GetPersonByIinRequestDodAttrs> = {
  iin: personAttrsVMap.iin,
};

export const getPersonByIinValidator: RequestDodValidator<GetPersonByIinServiceParams> =
  new DtoFieldValidator('getPersonByIin', true, { isArray: false }, 'dto', getPersonByIinVmap);
