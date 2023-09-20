/* eslint-disable no-use-before-define */
import { LiteralFieldValidator } from '../../../../src/domain/validator/field-validator/literal-field-validator';
import { RegexFormatValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/regex.field-v-rule';
import { EqualCharsCountValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/equal-chars-count.v-rule';
import { StringChoiceValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/string-choice.v-rule';
import { TrimStringLeadRule } from '../../../../src/domain/validator/rules/lead-rules/string/trim';
import { RangeNumberValidationRule } from '../../../../src/domain/validator/rules/validate-rules/number/range-number.v-rule';
import { UUIDFormatValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/uuid-format.v-rule';
import { IsTimeStampValidationRule } from '../../../../src/domain/validator/rules/validate-rules/timestamp/is-timestamp.v-rule';
import { ValidatorMap } from '../../../../src/domain/validator/field-validator/types';
import { DtoFieldValidator } from '../../../../src/domain/validator/field-validator/dto-field-validator';
import { Logger } from '../../../../src/common/logger/logger';
import { DODPrivateFixtures as DodFixtures } from '../../../dod-private-fixtures';

export namespace FieldValidatorPrivateFixtures {
  export const phoneAttrsValidatorMap: ValidatorMap<DodFixtures.PhoneAttrs> = {
    number: new LiteralFieldValidator(
      'number',
      'string',
      true,
      { isArray: false },
      [
        new RegexFormatValidationRule(
          /^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/,
          'Строка должна соответствовать формату: "+7-###-##-##"',
        ),
        new EqualCharsCountValidationRule(16),
      ],
      [new TrimStringLeadRule()],
    ),
    type: new LiteralFieldValidator(
      'type',
      'string',
      true,
      { isArray: false },
      [new StringChoiceValidationRule(['mobile', 'work'])],
      [new TrimStringLeadRule()],
    ),
    noOutField: new LiteralFieldValidator('noOutField', 'string', true, { isArray: false }, []),
  };

  const MIN_AGE = 18;
  const MAN_MAX_AGE = 65;
  const WOMAN_MAX_AGE = 63;

  export const emailAttrsValidatorMap: ValidatorMap<DodFixtures.EmailAttrs> = {
    value: new LiteralFieldValidator('value', 'string', true, { isArray: false }, []),
    noOutField: new LiteralFieldValidator('noOutField', 'string', true, { isArray: false }, []),
  };

  export const contactAttrsValidatormap: ValidatorMap<DodFixtures.PersonContactsAttrs> = {
    address: new LiteralFieldValidator('address', 'string', true, { isArray: false }, []),
    phones: new DtoFieldValidator('phones', 'dto', true, { isArray: true, mustBeFilled: true }, phoneAttrsValidatorMap),
    email: new DtoFieldValidator('email', 'dto', true, { isArray: false }, emailAttrsValidatorMap),
    noOutField: new LiteralFieldValidator('noOutField', 'string', true, { isArray: false }, []),
  };

  export class PersonIsWorkAgeFieldValidator<NAME extends string>
    extends LiteralFieldValidator<NAME, true, false, number> {
    constructor(attrName: NAME, personSex: 'man' | 'woman', required?: true) {
      super(attrName, 'number', required ?? true, { isArray: false }, [
        new RangeNumberValidationRule(
          MIN_AGE,
          personSex === 'man' ? MAN_MAX_AGE : WOMAN_MAX_AGE,
          'Возраст должен быть между {{min}} и {{max}}',
        ),
      ]);
    }
  }

  export const personAttrsValidatrorMap: ValidatorMap<DodFixtures.PersonAttrs> = {
    id: new LiteralFieldValidator('id', 'string', true, { isArray: false }, [new UUIDFormatValidationRule()]),
    name: new LiteralFieldValidator('name', 'string', true, { isArray: false }, []),
    lastName: new LiteralFieldValidator('lastName', 'string', true, { isArray: false }, []),
    birthday: new LiteralFieldValidator('birthday', 'number', true, { isArray: false }, [new IsTimeStampValidationRule()]),
    age: new PersonIsWorkAgeFieldValidator('age', 'man'),
    contacts: new DtoFieldValidator('contacts', 'dto', true, { isArray: false }, contactAttrsValidatormap),
  };

  export class AddPersonCommandValidator extends DtoFieldValidator<true, false, AddPersonCommand> {
    constructor() {
      super('dto', true, { isArray: false }, personAttrsValidatrorMap);
    }
  }

  export type AddPersonCommand = DodFixtures.PersonAttrs;

  export const addPersonCommand: AddPersonCommand = {
    id: 'c26ffd1c-8387-4350-93de-a630576ec60c',
    name: 'Saken',
    lastName: 'Sakenov',
    birthday: new Date('1981-01-15').getTime(),
    age: 25,
    contacts: DodFixtures.personContactAttrs,
  };
}

export namespace FieldValidatorTestMocksPrivateFixtures {
  class LoggerMock implements Logger {
    info(log: string): Promise<void> {
      throw new Error('Method not implemented.');
    }

    warning(log: string): Promise<void> {
      throw new Error('Method not implemented.');
    }

    assert(condition: boolean, log: string, logAttrs?: unknown): Promise<void> {
      throw new Error('Method not implemented.');
    }

    error(log: string, logAttrs?: unknown): never {
      throw new Error('Method not implemented.');
    }

    fatalError(log: string, logAttrs?: unknown): never {
      throw new Error('Method not implemented.');
    }
  }

  export function getLoggerMock(): Logger {
    return new LoggerMock();
  }
}
