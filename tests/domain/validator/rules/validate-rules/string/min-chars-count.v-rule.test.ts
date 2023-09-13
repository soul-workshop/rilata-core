import { describe, expect, test } from 'bun:test';
import { MinCharsCountValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/min-chars-count.v-rule';

describe('Line length should not be greater than', () => {
  const value = '123456';
  const equalValue = '01234';
  const lessValue = '012';
  test('failure, string length greater than minimum string length', () => {
    const sut = new MinCharsCountValidationRule(5);
    const result = sut.validate(value);
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('failure, string length equals minimum string length', () => {
    const sut = new MinCharsCountValidationRule(5);
    const result = sut.validate(equalValue);
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, string length must not be less than minimum string length', () => {
    const sut = new MinCharsCountValidationRule(5);
    const result = sut.validate(lessValue);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { minCount: 5 },
        text: 'Строка должна быть не меньше {{minCount}}',
      },
    });
  });
});
