import { describe, expect, test } from 'bun:test';
import { IsNumberTypeRule } from '../../../../../src/domain/validator/rules/type-rules/is-number-type.t-rule';

describe('IsNumberTypeRule', () => {
  test('success, received value equal number', () => {
    const rule = new IsNumberTypeRule();
    const result = rule.validate(42);
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('received value equal not equal number', () => {
    const rule = new IsNumberTypeRule();
    const valuesToCheck = ['not a number', ' ', '4', ['2', '3']];
    valuesToCheck.forEach((value) => {
      const validationResult = rule.validate(value);
      expect(validationResult).toEqual({
        behaviour: 'SaveErrorAndBreakValidation',
        ruleError: {
          hint: {},
          name: 'IsNumberTypeRule',
          text: 'Значение должно быть числовым',
        },
      });
    });
  });
});
