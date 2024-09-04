import { describe, expect, test } from 'bun:test';
import { LiteralFieldValidator } from './literal-field-validator.ts';
import { UUIDFormatValidationRule } from '../rules/validate-rules/string/uuid-format.v-rule.ts';
import { DtoFieldValidator } from './dto-field-validator.ts';
import { FullFieldResult } from './types.ts';
import { DTO } from '#domain/dto.js';
import { failure, success } from '#core/index.js';

const userRequestDTOValidatorMap = {
  userId: new LiteralFieldValidator('userId', false, { isArray: false }, 'string', [new UUIDFormatValidationRule()]),
  onMe: new LiteralFieldValidator('onMe', false, { isArray: false }, 'boolean', []),
};

class UserRequestDtoFieldValidator extends DtoFieldValidator<
'getUser',
true,
false,
{ userId?: string, onMe?: boolean}
> {
  constructor() {
    super('getUser', true, { isArray: false }, 'dto', userRequestDTOValidatorMap);
  }

  protected complexValidate(value: DTO): FullFieldResult {
    if (Boolean(value.userId) !== Boolean(value.onMe)) {
      return success(undefined);
    }
    return failure({
      ___dto_whole_value_validation_error___: [
        {
          text: 'DTO должен содержать либо userId, либо onMe',
          name: 'InvalidFieldCombinationError',
          hint: {},
        },
      ],
    });
  }
}

describe('User Request DTO валидатор тест', () => {
  const sut = new UserRequestDtoFieldValidator();
  test('Успех, обьект c ключом onMe валидный', () => {
    const result = sut.validate({
      onMe: true,
    });
    expect(result.isSuccess()).toBe(true);
  });
  test('Успех, обьект c ключом userId валидный', () => {
    const result = sut.validate({
      userId: 'd092833c-4bc6-405d-976e-912511fa85e3',
    });
    expect(result.isSuccess()).toBe(true);
  });
  test('Провал, получено оба валидные ключи (userId, onMe)', () => {
    const result = sut.validate({
      onMe: true,
      userId: 'd092833c-4bc6-405d-976e-912511fa85e3',
    });
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      ___dto_whole_value_validation_error___: [
        {
          text: 'DTO должен содержать либо userId, либо onMe',
          name: 'InvalidFieldCombinationError',
          hint: {},
        },
      ],
    });
  });

  test('Провал, получено оба ключа со значением undefined (userId, onMe)', () => {
    const result = sut.validate({});
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      ___dto_whole_value_validation_error___: [
        {
          text: 'DTO должен содержать либо userId, либо onMe',
          name: 'InvalidFieldCombinationError',
          hint: {},
        },
      ],
    });
  });
});
