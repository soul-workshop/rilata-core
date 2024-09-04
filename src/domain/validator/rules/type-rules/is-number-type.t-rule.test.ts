import { describe, expect, test } from 'bun:test';
import { IsNumberTypeRule } from './is-number-type.t-rule.ts';

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
