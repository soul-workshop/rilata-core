import { describe, expect, test } from 'bun:test';
import { RangeNumberValidationRule } from './range-number.v-rule.ts';

describe('Number must be in the range', () => {
  test('success, the resulting value in a range of numbers', () => {
    const sut = new RangeNumberValidationRule(18, 64);
    const result = sut.validate(31);
    expect(result).toEqual({ behaviour: 'SuccessRunNextRule' });
  });
  test('success, the resulting value is equal to the minimum value', () => {
    const sut = new RangeNumberValidationRule(18, 64);
    const result = sut.validate(18);
    expect(result).toEqual({ behaviour: 'SuccessRunNextRule' });
  });
  test('success, the resulting value is equal to the maximum value', () => {
    const sut = new RangeNumberValidationRule(18, 64);
    const result = sut.validate(64);
    expect(result).toEqual({ behaviour: 'SuccessRunNextRule' });
  });
  test('failure, the resulting value is greater than the maximum value', () => {
    const sut = new RangeNumberValidationRule(18, 64);
    const result = sut.validate(65);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { max: 64, min: 18 },
        name: 'RangeNumberValidationRule',
        text: 'Число должно быть в диапозоне от {{min}} до {{max}}',
      },
    });
  });
  test('failure, the resulting value is less than the minimum value', () => {
    const sut = new RangeNumberValidationRule(18, 64);
    const result = sut.validate(17);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { max: 64, min: 18 },
        name: 'RangeNumberValidationRule',
        text: 'Число должно быть в диапозоне от {{min}} до {{max}}',
      },
    });
  });
});
