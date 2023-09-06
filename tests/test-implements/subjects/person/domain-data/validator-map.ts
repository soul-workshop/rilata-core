import { CannotEmptyStringField } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/cannot-empty-string';
import { UuidField } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/uuid-field';
import { ValidatorMap } from '../../../../../src/domain/validator/field-validator/types';
import { TrimStringLeadRule } from '../../../../../src/domain/validator/rules/lead-rules/string/trim';
import { PersonAttrs } from './person-params';

export const personAttrsVMap: ValidatorMap<PersonAttrs> = {
  id: new UuidField(),
  name: new CannotEmptyStringField(true, [], [new TrimStringLeadRule()]),
  lastName: new CannotEmptyStringField(true, [], [new TrimStringLeadRule()]),
  patronomic: new CannotEmptyStringField(false, [], [new TrimStringLeadRule()]),
};
