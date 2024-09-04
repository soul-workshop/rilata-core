import { describe, expect, test } from 'bun:test';
import { RangeDataTimestampValidationRule } from './range-data.v-rule.ts';

describe('distance between dates', () => {
  const minDate = new Date('2000-01-01T12:00');
  const maxDate = new Date('2000-01-03T12:00');
  const sut = new RangeDataTimestampValidationRule(minDate, maxDate);
  test('success, date no more and no less than necessary', () => {
    const result = sut.validate(new Date('2000-01-02T12:00').getTime());
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('failure, date less than required', () => {
    const result = sut.validate(new Date('1999-01-02T11:55').getTime());
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        name: 'RangeDataTimestampValidationRule',
        text: 'Дата должна быть позже {{minDate}} и раньше {{maxDate}}',
      },
    });
  });

  test('failure, date is greater than required', () => {
    const result = sut.validate(new Date('2020-01-02T12:05').getTime());
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        name: 'RangeDataTimestampValidationRule',
        text: 'Дата должна быть позже {{minDate}} и раньше {{maxDate}}',
      },
    });
  });

  test('failure, value set to NaN', () => {
    const result = sut.validate(NaN);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        name: 'RangeDataTimestampValidationRule',
        text: 'Дата должна быть позже {{minDate}} и раньше {{maxDate}}',
      },
    });
  });

  test('failure, value set to -Infinity', () => {
    const result = sut.validate(-Infinity);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        name: 'RangeDataTimestampValidationRule',
        text: 'Дата должна быть позже {{minDate}} и раньше {{maxDate}}',
      },
    });
  });
});
