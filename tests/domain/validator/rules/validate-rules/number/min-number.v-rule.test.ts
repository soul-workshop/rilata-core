import { describe, expect, test } from 'bun:test';
import { MinNumberValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/number/min-number.v-rule';

describe('Number must be greater than or equal to', () => {
  const minAllowedNumber = 32;
  test('success, the resulting value is greater than or equal to the minimum number', () => {
    const sut = new MinNumberValidationRule(minAllowedNumber);
    const result = sut.validate(33);
    expect(result).toEqual({ behaviour: 'RunNextRule' });
  });

  test('success, the resulting value is equal to the minimum number', () => {
    const sut = new MinNumberValidationRule(minAllowedNumber);
    const result = sut.validate(32);
    expect(result).toEqual({ behaviour: 'RunNextRule' });
  });

  test('failure, initialization with a number less than the minimum number', () => {
    const sut = new MinNumberValidationRule(minAllowedNumber);
    const result = sut.validate(30);

    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { min: minAllowedNumber },
        text: 'Число должно быть больше или равно {{min}}',
      },
    });
  });
});
