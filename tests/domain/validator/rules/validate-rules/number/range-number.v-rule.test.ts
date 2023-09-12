import { describe, expect, test } from 'bun:test';
import { RangeNumberValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/number/range-number.v-rule';

describe('Number must be in the range', () => {
  test('success, the resulting value in a range of numbers', () => {
    const sut = new RangeNumberValidationRule(18, 64);
    const result = sut.validate(31);
    expect(result).toEqual({ behaviour: 'RunNextRule' });
  });
});
