import { InputDodValidator } from '../../../../../../src/app/service/types';
import { DtoFieldValidator } from '../../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../../src/domain/validator/field-validator/types';
import { personAttrsVMap } from '../../../domain-data/person/v-map';
import { AddPersonRequestDod, AddPersonRequestDodAttrs } from './s-params';

const addPersonVmap: ValidatorMap<AddPersonRequestDodAttrs> = {
  iin: personAttrsVMap.iin,
  firstName: personAttrsVMap.firstName,
  lastName: personAttrsVMap.lastName,
};

export const addPersonValidator: InputDodValidator<AddPersonRequestDod> =
  new DtoFieldValidator('addPerson', true, { isArray: false }, 'dto', addPersonVmap);
