import { InputDodValidator } from '../../../../../../src/api/service/types';
import { DtoFieldValidator } from '../../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../../src/domain/validator/field-validator/types';
import { personAttrsVMap } from '../../../domain-data/person/v-map';
import { GetPersonByIinRequestDod, GetPersonByIinRequestDodAttrs } from './s-params';

export const getPersonByIinVmap: ValidatorMap<GetPersonByIinRequestDodAttrs> = {
  iin: personAttrsVMap.iin,
};

export const getPersonByIinValidator: InputDodValidator<GetPersonByIinRequestDod> =
  new DtoFieldValidator('getPersonByIin', true, { isArray: false }, 'dto', getPersonByIinVmap);
