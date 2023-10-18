import { describe, expect, test } from 'bun:test';
import { IsArrayTypeRule } from '../../../../../src/domain/validator/rules/type-rules/is-array-type.t-rule';

describe('IsArrayTypeRule tests', () => {
  test('success, received value is an empty array or [1, 2, 3]', () => {
    const rule = new IsArrayTypeRule();
    const valuesToCheck = [[], [1, 2, 3]];
    valuesToCheck.forEach((value) => {
      const result = rule.validate(value);
      expect(result).toEqual({
        behaviour: 'SuccessRunNextRule',
      });
    });
  });

  test('should return "SaveErrorAndBreakValidation" for an array with different types', () => {
    const rule = new IsArrayTypeRule();
    const valuesToCheck = ['not an array', 42, true];
    valuesToCheck.forEach((value) => {
      const validationResult = rule.validate(value);
      expect(validationResult).toEqual({
        behaviour: 'SaveErrorAndBreakValidation',
        ruleError: {
          hint: {},
          text: 'Значение должно быть массивом данных',
        },
      });
    });
  });
});
