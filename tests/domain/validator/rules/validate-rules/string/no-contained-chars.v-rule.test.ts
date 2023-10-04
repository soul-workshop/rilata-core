import { describe, expect, test } from 'bun:test';
import { NoContainedCharsValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/no-contained-chars';

describe('String must not be equal to value', () => {
  test('success, the string does not contain illegal characters', () => {
    const sut = new NoContainedCharsValidationRule('5678');
    const result = sut.validate('123490');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, the string does not contain illegal characters', () => {
    const sut = new NoContainedCharsValidationRule('@');
    const result = sut.validate('petrop076gmail.com');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, the string does not contain illegal characters', () => {
    const sut = new NoContainedCharsValidationRule('1234567890');
    const result = sut.validate('no one number');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('failure, string contains invalid characters', () => {
    const sut = new NoContainedCharsValidationRule('@');
    const result = sut.validate('petrop076@gmail.com');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не должна содержать {{noChars}}',
      },
    });
  });

  test('failure, string contains invalid characters', () => {
    const sut = new NoContainedCharsValidationRule('1234567890');
    const result = sut.validate('1 number have');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не должна содержать {{noChars}}',
      },
    });
  });
});
