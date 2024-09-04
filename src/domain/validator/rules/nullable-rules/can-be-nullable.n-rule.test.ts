import { describe, expect, test } from 'bun:test';
import { CanBeNullableRule } from './can-be-nullable.n-rule.ts';

describe('CanBeNullableRule', () => {
  test('success, reseived value equal undefined or null', () => {
    const rule = new CanBeNullableRule();
    const valuesToCheck = [undefined, null];
    valuesToCheck.forEach((value) => {
      const validationResult = rule.validate(value);
      expect(validationResult).toEqual({
        behaviour: 'SuccessBreakValidation',
      });
    });
  });

  test('fail, received value equal not empty undefined or null', () => {
    const rule = new CanBeNullableRule();
    const valuesToCheck = ['not a number', '', '4', ['2', '3']];
    valuesToCheck.forEach((value) => {
      const validationResult = rule.validate(value);
      expect(validationResult).toEqual({
        behaviour: 'SuccessRunNextRule',
      });
    });
  });
});
