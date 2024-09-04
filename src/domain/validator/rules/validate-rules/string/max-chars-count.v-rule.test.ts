import { describe, expect, test } from 'bun:test';
import { MaxCharsCountValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/max-chars-count.v-rule';

describe('Line length should not be greater than', () => {
  test('success, string length is less than maximum string length', () => {
    const sut = new MaxCharsCountValidationRule(10);
    const result = sut.validate('hello');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('success, string length equals maximum string length', () => {
    const sut = new MaxCharsCountValidationRule(5);
    const result = sut.validate('hello');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('failure, string length greater than maximum string length', () => {
    const sut = new MaxCharsCountValidationRule(10);
    const result = sut.validate('hello hello');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { maxCount: 10 },
        name: 'MaxCharsCountValidationRule',
        text: 'Длина строки должна быть не больше {{maxCount}}',
      },
    });
  });
});
