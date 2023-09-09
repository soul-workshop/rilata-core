import { DtoFieldValidator } from '../../../../../src/domain/validator/field-validator/dto-field-validator';
import { LiteralFieldValidator } from '../../../../../src/domain/validator/field-validator/literal-field-validator';
import { CannotEmptyStringField } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/cannot-empty-string';
import { StringChoiceFieldValidator } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/choice';
import { UuidField } from '../../../../../src/domain/validator/field-validator/prepared-fields/string/uuid-field';
import { ValidatorMap } from '../../../../../src/domain/validator/field-validator/types';
import { TrimStringLeadRule } from '../../../../../src/domain/validator/rules/lead-rules/string/trim';
import { EmailFormatValidationRule } from '../../../../../src/domain/validator/rules/validate-rules/string/email-format.field-v-rule';
import { RegexFormatValidationRule } from '../../../../../src/domain/validator/rules/validate-rules/string/regex.field-v-rule';
import { PhoneNumberFieldValidator } from './field-validators';
import {
  ContactsAttrs, EmailAttrs, PersonAttrs, PhoneAttrs,
} from './params';

const phoneVMap: ValidatorMap<PhoneAttrs> = {
  number: new PhoneNumberFieldValidator<true, false>(true, { isArray: false }, []),
  type: new StringChoiceFieldValidator<true, false>(true, { isArray: false }, ['mobile', 'work', 'home']),
};

const emailVMap: ValidatorMap<EmailAttrs> = {
  email: new LiteralFieldValidator('string', true, { isArray: false }, [new EmailFormatValidationRule()]),
  type: new StringChoiceFieldValidator<true, false>(true, { isArray: false }, ['corporate', 'private']),
};

const contactsVMap: ValidatorMap<ContactsAttrs> = {
  phones: new DtoFieldValidator('dto', true, { isArray: true, mustBeFilled: true }, phoneVMap),
  email: new DtoFieldValidator('dto', false, { isArray: true }, emailVMap),
  address: new CannotEmptyStringField(false, []),
};

export const personAttrsVMap: ValidatorMap<PersonAttrs> = {
  id: new UuidField(),
  govPersonId: new CannotEmptyStringField(true, [new RegexFormatValidationRule(/^[0-9]{12}$/, 'ИИН должен содержать только 12 цифровых символов.')]),
  name: new CannotEmptyStringField(true, [], [new TrimStringLeadRule()]),
  lastName: new CannotEmptyStringField(true, [], [new TrimStringLeadRule()]),
  patronomic: new CannotEmptyStringField(false, [], [new TrimStringLeadRule()]),
  contacts: new DtoFieldValidator('dto', true, { isArray: false }, contactsVMap),
};
