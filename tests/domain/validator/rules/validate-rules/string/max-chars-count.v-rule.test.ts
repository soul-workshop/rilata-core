import { describe, expect, test } from 'bun:test';
import { MaxCharsCountValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/max-chars-count.v-rule';

describe('Line length should not be greater than', () => {
  const value = '0123456789';
  const equalValue = '012345678910111';
  const greaterValue = '012345678910111213';
  test('failure, string length is less than maximum string length', () => {
    const sut = new MaxCharsCountValidationRule(15);
    const result = sut.validate(value);
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('failure, string length equals maximum string length', () => {
    const sut = new MaxCharsCountValidationRule(15);
    const result = sut.validate(equalValue);
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, string length greater than maximum string length', () => {
    const sut = new MaxCharsCountValidationRule(15);
    const result = sut.validate(greaterValue);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { maxCount: 15 },
        text: 'Строка должна быть не больше {{maxCount}}',
      },
    });
  });
});
