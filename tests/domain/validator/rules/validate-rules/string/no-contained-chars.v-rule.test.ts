import { describe, expect, test } from 'bun:test';
import { NoContainedCharsValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/no-contained-chars';

describe('String must not be equal to value', () => {
  test('success, string not equal to value', () => {
    const sut = new NoContainedCharsValidationRule('1234567890');
    const result = sut.validate('qwertyuiop[]asdfghjkl;zxcvbnm,');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, string not equal to value', () => {
    const sut = new NoContainedCharsValidationRule('abcdefg');
    const result = sut.validate('hijklmno');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, string not equal to value', () => {
    const sut = new NoContainedCharsValidationRule('8');
    const result = sut.validate('123456790');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, string not equal to value', () => {
    const sut = new NoContainedCharsValidationRule('1234567');
    const result = sut.validate('numberNumbers000499');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не должна содержать {{noChars}}',
      },
    });
  });

  test('success, string not equal to value', () => {
    const sut = new NoContainedCharsValidationRule('');
    const result = sut.validate('074352310436946');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не должна содержать {{noChars}}',
      },
    });
  });
});
