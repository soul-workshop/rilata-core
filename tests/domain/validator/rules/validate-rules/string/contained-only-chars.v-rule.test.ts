import { describe, expect, test } from 'bun:test';
import { ContainedOnlyCharsValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/contained-only-chars';

describe('String must be equal to value', () => {
  test('success, string equal value', () => {
    const sut = new ContainedOnlyCharsValidationRule('123456789');
    const result = sut.validate('123456789');
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

  test('failure, string is not equal value', () => {
    const sut = new ContainedOnlyCharsValidationRule('omb');
    const result = sut.validate('bom mood');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка должна содержать только {{onlyChars}}',
      },
    });
  });
});
