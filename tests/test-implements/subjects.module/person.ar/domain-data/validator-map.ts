import { CannotEmptyStringField } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/cannot-empty-string';
import { UuidField } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/uuid-field';
import { ValidatorMap } from '../../../../../src/domain/validator/field-validator/types';
import { TrimStringLeadRule } from '../../../../../src/domain/validator/rules/lead-rules/string/trim';
import { RegexFormatValidationRule } from '../../../../../src/domain/validator/rules/validate-rules/string/regex.field-v-rule';
import { PersonAttrs } from './person-params';

export const personAttrsVMap: ValidatorMap<PersonAttrs> = {
  id: new UuidField(),
  govPersonId: new CannotEmptyStringField(true, [new RegexFormatValidationRule(/^[0-9]{12}$/, 'ИИН должен содержать только 12 цифровых символов.')]),
  name: new CannotEmptyStringField(true, [], [new TrimStringLeadRule()]),
  lastName: new CannotEmptyStringField(true, [], [new TrimStringLeadRule()]),
  patronomic: new CannotEmptyStringField(false, [], [new TrimStringLeadRule()]),
};
