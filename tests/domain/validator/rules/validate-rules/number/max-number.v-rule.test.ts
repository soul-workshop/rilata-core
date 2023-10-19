import { describe, expect, test } from 'bun:test';
import { MaxNumberValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/number/max-number.v-rule';

describe('Number must be less than or equal to', () => {
  const maxAllowedNumber = 32;
  test('success, the resulting value is less than or equal to the maximum number', () => {
    const sut = new MaxNumberValidationRule(maxAllowedNumber);
    const result = sut.validate(31);
    expect(result).toEqual({ behaviour: 'SuccessRunNextRule' });
  });

  test('success, the resulting value is equal to the maximum number', () => {
    const sut = new MaxNumberValidationRule(maxAllowedNumber);
    const result = sut.validate(32);
    expect(result).toEqual({ behaviour: 'SuccessRunNextRule' });
  });

  test('failure, initialization with a number greater than a  large number', () => {
    const sut = new MaxNumberValidationRule(maxAllowedNumber);
    const result = sut.validate(33);

    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { max: maxAllowedNumber },
        text: 'Число должно быть меньше или равно {{max}}',
      },
    });
  });
});
