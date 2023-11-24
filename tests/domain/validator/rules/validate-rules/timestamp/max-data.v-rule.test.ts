import { describe, expect, test } from 'bun:test';
import { MaxDateStampValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/timestamp/max-data.v-rule';

describe('Value is a date', () => {
  const date = new Date(2051, 8, 14, 14, 53, 0);
  test('success, the resulting value is a date', () => {
    const sut = new MaxDateStampValidationRule(date);
    const result = sut.validate(2578297780000);
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('failure, if the value is given as a future date', () => {
    const sut = new MaxDateStampValidationRule(date);
    const result = sut.validate(2679298980000);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { maxDate: 2578315980000 },
        name: 'MaxDateStampValidationRule',
        text: 'Дата должно быть раньше {{maxDate}}',
      },
    });
  });
  test('failure, if the value is given as a NaN', () => {
    const sut = new MaxDateStampValidationRule(date);
    const result = sut.validate(NaN);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { maxDate: 2578315980000 },
        name: 'MaxDateStampValidationRule',
        text: 'Дата должно быть раньше {{maxDate}}',
      },
    });
  });
  test('failure, if the value is given as a Infinity', () => {
    const sut = new MaxDateStampValidationRule(date);
    const result = sut.validate(Infinity);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { maxDate: 2578315980000 },
        name: 'MaxDateStampValidationRule',
        text: 'Дата должно быть раньше {{maxDate}}',
      },
    });
  });
});
