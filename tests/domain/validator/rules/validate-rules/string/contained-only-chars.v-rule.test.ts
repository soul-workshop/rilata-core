import { describe, expect, test } from 'bun:test';
import { ContainedOnlyCharsValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/contained-only-chars';

describe('String must be equal to value', () => {
  test('success, string equal value', () => {
    const sut = new ContainedOnlyCharsValidationRule('572741945712987');
    const result = sut.validate('572741945712987');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('успех, все символы допустимы', () => {
    const sut = new ContainedOnlyCharsValidationRule('omb');
    const result = sut.validate('bom');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('успех, допускается несколько раз использовать один символ', () => {
    const sut = new ContainedOnlyCharsValidationRule('omb');
    const result = sut.validate('bomb');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('успех, можно успользовать только один символ много раз', () => {
    const sut = new ContainedOnlyCharsValidationRule('omb');
    const result = sut.validate('ooooo');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('failure, string is not equal value', () => {
    const sut = new ContainedOnlyCharsValidationRule('omb');
    const result = sut.validate('bod');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка должна содержать только {{onlyChars}}',
      },
    });
  });
});
