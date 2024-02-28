import { LiteralFieldValidator } from '../../../../../src/domain/validator/field-validator/literal-field-validator';
import { UuidField } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/uuid-field';
import { ValidatorMap } from '../../../../../src/domain/validator/field-validator/types';
import { RegexMatchesValueValidationRule } from '../../../../../src/domain/validator/rules/validate-rules/string/regex-matches-value.field-v-rule';
import { UserAttrs } from './params';

export const userAttrsVmap: ValidatorMap<UserAttrs> = {
  userId: new UuidField('userId'),
  personIin: new LiteralFieldValidator('personIin', true, { isArray: false }, 'string', [
    new RegexMatchesValueValidationRule(/^[0-9]{12}$/, 'Может быть только 12 цифр'),
  ]),
};
