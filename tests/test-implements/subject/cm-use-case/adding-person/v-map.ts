/* eslint-disable function-paren-newline */
import { ActionDodValidator } from '../../../../../src/app/use-case/types';
import { DtoFieldValidator } from '../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../src/domain/validator/field-validator/types';
import { AddingPersonDomainCommand } from '../../domain-data/person/add-person.params';
import { personAttrsVMap } from '../../domain-data/person/v-map';
import { AddingPersonUCParams } from './params';

export const addPersonAttrsVMap: ValidatorMap<AddingPersonDomainCommand> = {
  govPersonId: personAttrsVMap.govPersonId,
  name: personAttrsVMap.name,
  lastName: personAttrsVMap.lastName,
  patronomic: personAttrsVMap.patronomic,
};

export const addPersonValidator: ActionDodValidator<AddingPersonUCParams> = new DtoFieldValidator(
  'addPerson', true, { isArray: false }, 'dto', addPersonAttrsVMap,
);
