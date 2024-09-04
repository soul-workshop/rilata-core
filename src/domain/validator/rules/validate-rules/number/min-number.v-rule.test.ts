import { describe, expect, test } from 'bun:test';
import { MinNumberValidationRule } from './min-number.v-rule.ts';

describe('Number must be greater than or equal to', () => {
  const minAllowedNumber = 32;
  test('success, the resulting value is greater than or equal to the minimum number', () => {
    const sut = new MinNumberValidationRule(minAllowedNumber);
    const result = sut.validate(33);
    expect(result).toEqual({ behaviour: 'SuccessRunNextRule' });
  });

  test('success, the resulting value is equal to the minimum number', () => {
    const sut = new MinNumberValidationRule(minAllowedNumber);
    const result = sut.validate(32);
    expect(result).toEqual({ behaviour: 'SuccessRunNextRule' });
  });

  test('failure, initialization with a number less than the minimum number', () => {
    const sut = new MinNumberValidationRule(minAllowedNumber);
    const result = sut.validate(30);

    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { min: minAllowedNumber },
        name: 'MinNumberValidationRule',
        text: 'Число должно быть больше или равно {{min}}',
      },
    });
  });
});
