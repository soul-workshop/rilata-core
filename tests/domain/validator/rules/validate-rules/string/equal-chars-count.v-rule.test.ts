import { describe, expect, test } from 'bun:test';
import { EqualCharsCountValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/equal-chars-count.v-rule';

describe('Length of the string must be equal to', () => {
  const value = '0123456789';

  test('success, string more than count', () => {
    const sut = new EqualCharsCountValidationRule(5);
    const result = sut.validate(value);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { count: 5, current: value.length },
        text: 'Строка должна быть равна {{count}}, сейчас {{current}}',
      },
    });
  });

  test('failed, string equals count', () => {
    const sut = new EqualCharsCountValidationRule(10);
    const result = sut.validate(value);
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });
});
