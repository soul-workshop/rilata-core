import { describe, expect, test } from 'bun:test';
import { MinCharsCountValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/min-chars-count.v-rule';

describe('Line length should not be greater than', () => {
  const value = 'hello';
  test('failure, string length greater than maximum string length', () => {
    const sut = new MinCharsCountValidationRule(10);
    const result = sut.validate('hello hello');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, string length is less than maximum string length', () => {
    const sut = new MinCharsCountValidationRule(10);
    const result = sut.validate(value);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { minCount: 10 },
        text: 'Строка должна быть не меньше {{minCount}}',
      },
    });
  });

  test('success, string length equals maximum string length', () => {
    const sut = new MinCharsCountValidationRule(5);
    const result = sut.validate('hello');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });
});
