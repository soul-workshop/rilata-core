import { describe, expect, test } from 'bun:test';
import { MinCharsCountValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/min-chars-count.v-rule';

describe('Line length should not be greater than', () => {
  test('success, string length equals minimum string length', () => {
    const sut = new MinCharsCountValidationRule(10);
    const result = sut.validate('hello hello');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('success, string length equals minimum string length', () => {
    const sut = new MinCharsCountValidationRule(5);
    const result = sut.validate('hello');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('failure, string length greater than minimum string length', () => {
    const sut = new MinCharsCountValidationRule(10);
    const result = sut.validate('hello');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { minCount: 10 },
        name: 'MinCharsCountValidationRule',
        text: 'Строка должна быть не меньше {{minCount}}',
      },
    });
  });
});
