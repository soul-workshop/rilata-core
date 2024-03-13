import { RequestDodValidator } from '../../../../../../src/app/service/types';
import { DtoFieldValidator } from '../../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../../src/domain/validator/field-validator/types';
import { personAttrsVMap } from '../../../domain-data/person/v-map';
import { AddPersonRequestDodAttrs, AddPersonServiceParams } from './s-params';

const addPersonVmap: ValidatorMap<AddPersonRequestDodAttrs> = {
  iin: personAttrsVMap.iin,
  firstName: personAttrsVMap.firstName,
  lastName: personAttrsVMap.lastName,
};

export const addPersonValidator: RequestDodValidator<AddPersonServiceParams> =
  new DtoFieldValidator('addPerson', true, { isArray: false }, 'dto', addPersonVmap);
