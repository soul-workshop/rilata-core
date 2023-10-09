import { describe, expect, test } from 'bun:test';
import { RangeDataTimestampValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/timestamp/range-data.v-rule';

describe('distance between dates', () => {
  const minDate = new Date(2000, 0, 1, 12, 0, 0);
  const maxDate = new Date(2000, 0, 3, 12, 0, 0);
  const sut = new RangeDataTimestampValidationRule(minDate, maxDate);
  test('success, date no more and no less than necessary', () => {
    const result = sut.validate(946800000000); // 2000, 0, 2, 12, 0, 0
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });
  test('failure, date less than required', () => {
    const result = sut.validate(915264000000); // 1999, 0, 2, 12, 0, 0
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Дата должна быть позже {{minDate}} и раньше {{maxDate}}',
      },
    });
  });

  test('failure, date is greater than required', () => {
    const result = sut.validate(1577948400000); // 2020, 0, 2, 12, 0, 0
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
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
        text: 'Дата должна быть позже {{minDate}} и раньше {{maxDate}}',
      },
    });
  });
});
