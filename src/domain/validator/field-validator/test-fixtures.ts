import { DODPrivateFixtures as DodFixtures } from '#core/utils/dod/dod-private-fixtures.js';
import { RangeNumberValidationRule } from '../rules/validate-rules/number/range-number.v-rule.ts';
import { EqualCharsCountValidationRule } from '../rules/validate-rules/string/equal-chars-count.v-rule.ts';
import { RegexMatchesValueValidationRule } from '../rules/validate-rules/string/regex-matches-value.field-v-rule.ts';
import { StringChoiceValidationRule } from '../rules/validate-rules/string/string-choice.v-rule.ts';
import { UUIDFormatValidationRule } from '../rules/validate-rules/string/uuid-format.v-rule.ts';
import { IsTimeStampValidationRule } from '../rules/validate-rules/timestamp/is-timestamp.v-rule.ts';
import { DtoFieldValidator } from './dto-field-validator.ts';
import { LiteralFieldValidator } from './literal-field-validator.ts';
import { ValidatorMap } from './types.ts';

export namespace FieldValidatorPrivateFixtures {
  export const phoneAttrsValidatorMap: ValidatorMap<DodFixtures.PhoneAttrs> = {
    number: new LiteralFieldValidator(
      'number',
      true,
      { isArray: false },
      'string',
      [
        new RegexMatchesValueValidationRule(
          /^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/,
          'Строка должна соответствовать формату: "+7-###-##-##"',
        ),
        new EqualCharsCountValidationRule(16),
      ],
    ),
    type: new LiteralFieldValidator(
      'type',
      true,
      { isArray: false },
      'string',
      [new StringChoiceValidationRule(['mobile', 'work'])],
    ),
    noOutField: new LiteralFieldValidator('noOutField', true, { isArray: false }, 'string', []),
  };

  const MIN_AGE = 18;
  const MAN_MAX_AGE = 65;
  const WOMAN_MAX_AGE = 63;

  export const emailAttrsValidatorMap: ValidatorMap<DodFixtures.EmailAttrs> = {
    value: new LiteralFieldValidator('value', true, { isArray: false }, 'string', []),
    noOutField: new LiteralFieldValidator('noOutField', true, { isArray: false }, 'string', []),
  };

  export const contactAttrsValidatormap: ValidatorMap<DodFixtures.PersonContactsAttrs> = {
    address: new LiteralFieldValidator('address', true, { isArray: false }, 'string', []),
    phones: new DtoFieldValidator('phones', true, { isArray: true, mustBeFilled: true }, 'dto', phoneAttrsValidatorMap),
    email: new DtoFieldValidator('email', true, { isArray: false }, 'dto', emailAttrsValidatorMap),
    noOutField: new LiteralFieldValidator('noOutField', true, { isArray: false }, 'string', []),
  };

  export class PersonIsWorkAgeFieldValidator<NAME extends string>
    extends LiteralFieldValidator<NAME, true, false, number> {
    constructor(attrName: NAME, personSex: 'man' | 'woman', required?: true) {
      super(attrName, required ?? true, { isArray: false }, 'number', [
        new RangeNumberValidationRule(
          MIN_AGE,
          personSex === 'man' ? MAN_MAX_AGE : WOMAN_MAX_AGE,
          'Возраст должен быть между {{min}} и {{max}}',
        ),
      ]);
    }
  }

  export const personAttrsValidatrorMap: ValidatorMap<DodFixtures.PersonAttrs> = {
    id: new LiteralFieldValidator('id', true, { isArray: false }, 'string', [new UUIDFormatValidationRule()]),
    name: new LiteralFieldValidator('name', true, { isArray: false }, 'string', []),
    lastName: new LiteralFieldValidator('lastName', true, { isArray: false }, 'string', []),
    birthday: new LiteralFieldValidator('birthday', true, { isArray: false }, 'number', [new IsTimeStampValidationRule()]),
    age: new PersonIsWorkAgeFieldValidator('age', 'man'),
    contacts: new DtoFieldValidator('contacts', true, { isArray: false }, 'dto', contactAttrsValidatormap),
  };

  export type AddPersonCommand = DodFixtures.PersonAttrs;
  export class AddPersonCommandValidator extends DtoFieldValidator<
    'AddPersonCommand', true, false, AddPersonCommand
  > {
    constructor() {
      super('AddPersonCommand', true, { isArray: false }, 'dto', personAttrsValidatrorMap);
    }
  }

  export const addPersonCommand: AddPersonCommand = {
    id: 'c26ffd1c-8387-4350-93de-a630576ec60c',
    name: 'Saken',
    lastName: 'Sakenov',
    birthday: new Date('1981-01-15').getTime(),
    age: 25,
    contacts: DodFixtures.personContactAttrs,
  };
}
