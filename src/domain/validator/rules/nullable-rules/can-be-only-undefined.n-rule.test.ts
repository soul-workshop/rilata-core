import { describe, expect, test } from 'bun:test';
import { CanBeUndefinedValidationRule } from './can-be-only-undefined.n-rule.ts';

describe('CanBeNullableRule tests', () => {
  test('success, received value equal null', () => {
    const value = undefined;
    const rule = new CanBeUndefinedValidationRule();
    const validationResult = rule.validate(value);
    expect(validationResult).toEqual({
      behaviour: 'SuccessBreakValidation',
    });
  });

  test('fail, received value equal not empty undefined', () => {
    const rule = new CanBeUndefinedValidationRule();
    const valuesToCheck = ['not a number', '', '4', ['2', '3']];
    valuesToCheck.forEach((value) => {
      const validationResult = rule.validate(value);
      expect(validationResult).toEqual({
        behaviour: 'SuccessRunNextRule',
      });
    });
  });
});
