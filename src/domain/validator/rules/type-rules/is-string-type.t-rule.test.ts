import { describe, expect, test } from 'bun:test';
import { IsStringTypeRule } from './is-string-type.t-rule.ts';

describe('IsStringTypeRule', () => {
  test('success, received value equal string', () => {
    const rule = new IsStringTypeRule();
    const result = rule.validate('Hello World');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('received value not equal string', () => {
    const rule = new IsStringTypeRule();
    const valuesToCheck = [3, [2, 3]];
    valuesToCheck.forEach((value) => {
      const validationResult = rule.validate(value);
      expect(validationResult).toEqual({
        behaviour: 'SaveErrorAndBreakValidation',
        ruleError: {
          hint: {},
          name: 'IsStringTypeRule',
          text: 'Значение должно быть строковым значением',
        },
      });
    });
  });
});
