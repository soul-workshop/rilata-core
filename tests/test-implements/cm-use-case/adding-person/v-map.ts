import { StrictEqualFieldValidator } from '../../../../src/domain/validator/field-validator/prepared-fields/string/strict-equal';
import { CommandValidatorMap, ValidatorMap } from '../../../../src/domain/validator/field-validator/types';
import { AddingPersonDomainCommand } from '../../domain-data/person/params';
import { personAttrsVMap } from '../../domain-data/person/v-map';
import { AddingPersonUCCommand } from './params';

const addingPersonVMap: ValidatorMap<AddingPersonDomainCommand> = {
  govPersonId: personAttrsVMap.govPersonId,
  name: personAttrsVMap.name,
  lastName: personAttrsVMap.lastName,
  patronomic: personAttrsVMap.patronomic,
};

export const addingPersonCommandVMap: CommandValidatorMap<AddingPersonUCCommand> = {
  attrs: addingPersonVMap,
  name: new StrictEqualFieldValidator('AddingPersonCommand'),
};
