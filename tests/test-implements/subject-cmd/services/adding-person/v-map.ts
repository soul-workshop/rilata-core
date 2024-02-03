/* eslint-disable function-paren-newline */
import { ActionDodValidator } from '../../../../../src/app/service/types';
import { DtoFieldValidator } from '../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../src/domain/validator/field-validator/types';
import { AddingPersonDomainCommand } from '../../domain-data/person/add-person.params';
import { personAttrsVMap } from '../../domain-data/person/v-map';
import { AddingPersonServiceParams } from './s-params';

export const addPersonAttrsVMap: ValidatorMap<AddingPersonDomainCommand> = {
  govPersonId: personAttrsVMap.govPersonId,
  name: personAttrsVMap.name,
  lastName: personAttrsVMap.lastName,
  patronomic: personAttrsVMap.patronomic,
};

// eslint-disable-next-line max-len
export const addPersonValidator: ActionDodValidator<AddingPersonServiceParams> = new DtoFieldValidator(
  'addPerson', true, { isArray: false }, 'dto', addPersonAttrsVMap,
);
