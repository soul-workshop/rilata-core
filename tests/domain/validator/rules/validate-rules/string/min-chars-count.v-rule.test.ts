import { describe, expect, test } from 'bun:test';
import { MinCharsCountValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/min-chars-count.v-rule';

describe('Line length should not be greater than', () => {
  test('failure, string length greater than minimum string length', () => {
    const sut = new MinCharsCountValidationRule(5);
    const result = sut.validate('hello, how a u?');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('failure, string length equals minimum string length', () => {
    const sut = new MinCharsCountValidationRule(5);
    const result = sut.validate('hello');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, string length must not be less than minimum string length', () => {
    const sut = new MinCharsCountValidationRule(5);
    const result = sut.validate('hola');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { minCount: 5 },
        text: 'Строка должна быть не меньше {{minCount}}',
      },
    });
  });
});
