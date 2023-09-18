import { describe, expect, test } from 'bun:test';
import { CanBeUndefinedValidationRule } from '../../../../../src/domain/validator/rules/nullable-rules/can-be-only-undefined.n-rule';

describe('CanBeNullableRule tests', () => {
  test('success, received value equal null', () => {
    const value = undefined;
    const rule = new CanBeUndefinedValidationRule();
    const validationResult = rule.validate(value);
    expect(validationResult).toEqual({
      behaviour: 'BreakValidation',
    });
  });

  test('fail, received value equal not empty undefined', () => {
    const rule = new CanBeUndefinedValidationRule();
    const valuesToCheck = ['not a number', '', '4', ['2', '3']];
    valuesToCheck.forEach((value) => {
      const validationResult = rule.validate(value);
      expect(validationResult).toEqual({
        behaviour: 'RunNextRule',
      });
    });
  });
});
