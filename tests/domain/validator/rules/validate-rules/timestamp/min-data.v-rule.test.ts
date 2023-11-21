import { describe, expect, test } from 'bun:test';
import { MinDateStampValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/timestamp/min-data.v-rule';

describe('Value is a date', () => {
  const date = new Date(2000, 0, 1, 12, 0, 0);
  test('success, the resulting value is a date', () => {
    const sut = new MinDateStampValidationRule(date);
    const result = sut.validate(978332400000);
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('failure, if the value is given as a past date', () => {
    const sut = new MinDateStampValidationRule(date);
    const result = sut.validate(915174000000);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { minDate: 946728000000 },
        name: 'MinDateStampValidationRule',
        text: 'Дата должно быть позже {{minDate}}',
      },
    });
  });
  test('failure, if the value is given as a NaN', () => {
    const sut = new MinDateStampValidationRule(date);
    const result = sut.validate(NaN);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { minDate: 946728000000 },
        name: 'MinDateStampValidationRule',
        text: 'Дата должно быть позже {{minDate}}',
      },
    });
  });
  test('failure, if the value is given as a Infinity', () => {
    const sut = new MinDateStampValidationRule(date);
    const result = sut.validate(-Infinity);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { minDate: 946728000000 },
        name: 'MinDateStampValidationRule',
        text: 'Дата должно быть позже {{minDate}}',
      },
    });
  });
});
