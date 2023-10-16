import { describe, expect, test } from 'bun:test';
import { ContainedOnlyCharsValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/contained-only-chars.v-rule';

describe('String must be equal to value', () => {
  test('success, string equal value', () => {
    const sut = new ContainedOnlyCharsValidationRule('572374194057129687');
    const result = sut.validate('0123456789');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, string equal value', () => {
    const sut = new ContainedOnlyCharsValidationRule('omb');
    const result = sut.validate('bom');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, string equal value', () => {
    const sut = new ContainedOnlyCharsValidationRule('omb');
    const result = sut.validate('bomb');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, string equal value2', () => {
    const sut = new ContainedOnlyCharsValidationRule('omb');
    const result = sut.validate('ooooo');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, string equal value2', () => {
    const sut = new ContainedOnlyCharsValidationRule('b');
    const result = sut.validate('b');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('failure, string is not equal value', () => {
    const sut = new ContainedOnlyCharsValidationRule('s');
    const result = sut.validate('b');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { onlyChars: 's' },
        text: 'Строка должна содержать только {{onlyChars}}',
      },
    });
  });

  test('failure, string is not equal value', () => {
    const sut = new ContainedOnlyCharsValidationRule(' ', 'Строка должна содержать только пробел');
    const result = sut.validate('wew');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { onlyChars: ' ' },
        text: 'Строка должна содержать только пробел',
      },
    });
  });

  test('failure, string is not equal value', () => {
    const sut = new ContainedOnlyCharsValidationRule('omb');
    const result = sut.validate('bod');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { onlyChars: 'omb' },
        text: 'Строка должна содержать только {{onlyChars}}',
      },
    });
  });
});
