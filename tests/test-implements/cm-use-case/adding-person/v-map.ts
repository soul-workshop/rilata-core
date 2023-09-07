import { StrictEqualFieldValidator } from '../../../../../../src/domain/validator/field-validator/prepared-fields/string/strict-equal';
import { CommandValidatorMap, ValidatorMap } from '../../../../../../src/domain/validator/field-validator/types';
import { AddingPersonDomainCommand } from '../../domain-data/person-params';
import { personAttrsVMap } from '../../domain-data/validator-map';

const addingPersonVMap: ValidatorMap<AddingPersonDomainCommand['attrs']> = {
  govPersonId: personAttrsVMap.govPersonId,
  name: personAttrsVMap.name,
  lastName: personAttrsVMap.lastName,
  patronomic: personAttrsVMap.patronomic,
};

export const addingPersonCommandVMap: CommandValidatorMap<AddingPersonDomainCommand> = {
  attrs: addingPersonVMap,
  name: new StrictEqualFieldValidator('AddingPersonCommand'),
};
