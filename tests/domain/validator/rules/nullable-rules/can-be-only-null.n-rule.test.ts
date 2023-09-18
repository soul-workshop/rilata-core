import { describe, expect, test } from 'bun:test';
import { CanBeNullValidationRule } from '../../../../../src/domain/validator/rules/nullable-rules/can-be-only-null.n-rule';

describe('CanBeNullableRule', () => {
  test('success, received value equal null', () => {
    const value = null;
    const rule = new CanBeNullValidationRule();
    const validationResult = rule.validate(value);
    expect(validationResult).toEqual({
      behaviour: 'BreakValidation',
    });
  });

  test('fail, received value equal not empty null', () => {
    const rule = new CanBeNullValidationRule();
    const valuesToCheck = ['not a number', '', '4', ['2', '3']];
    valuesToCheck.forEach((value) => {
      const validationResult = rule.validate(value);
      expect(validationResult).toEqual({
        behaviour: 'RunNextRule',
      });
    });
  });
});
