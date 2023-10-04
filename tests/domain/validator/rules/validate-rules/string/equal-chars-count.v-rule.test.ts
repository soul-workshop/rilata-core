import { describe, expect, test } from 'bun:test';
import { EqualCharsCountValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/equal-chars-count.v-rule';

describe('Length of the string must be equal to', () => {
  const value = 'hello';

  test('success, string length more than count', () => {
    const sut = new EqualCharsCountValidationRule(4);
    const result = sut.validate(value);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { count: 4, current: value.length },
        text: 'Длина строки должна быть равна {{count}}, сейчас {{current}}',
      },
    });
  });

  test('success, string length more', () => {
    const sut = new EqualCharsCountValidationRule(5);
    const result = sut.validate('hhheeeellllooo');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { count: 5, current: 'hhheeeellllooo'.length },
        text: 'Длина строки должна быть равна {{count}}, сейчас {{current}}',
      },
    });
  });

  test('failure, string equals count', () => {
    const sut = new EqualCharsCountValidationRule(5);
    const result = sut.validate(value);
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });
});
