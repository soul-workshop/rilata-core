import { describe, expect, test } from 'bun:test';
import { DtoFieldErrors } from '../../../../src/domain/validator/field-validator/types';
import { RuleError } from '../../../../src/domain/validator/rules/types';
import { ValidationRule } from '../../../../src/domain/validator/rules/validation-rule';
import { FieldValidatorPrivateFixtures as FieldValidatorFixtures } from './test-fixtures';

describe('array validate', () => {
  const sut = FieldValidatorFixtures.contactAttrsValidatormap.phones;

  test('success', () => {
    const result = sut.validate([{ number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' }, { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' }]);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toBe(undefined);
  });

  test('failure, The value must not be undefined or null', () => {
    const result = sut.validate([]);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      phones: [
        {
          text: 'Значение должно быть не пустым массивом данных',
          hint: {},
        },
      ],
    });
  });

  test('failure, the value must be an array of data', () => {
    const result = sut.validate('r');
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      phones: [
        {
          hint: {},
          text: 'Значение должно быть массивом данных',
        },
      ],
    });
  });
});
