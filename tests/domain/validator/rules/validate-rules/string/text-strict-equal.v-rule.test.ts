import { describe, expect, test } from 'bun:test';
import { TextStrictEqualValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/text-strict-equal.v-rule';

describe('String must not be equal to value {{strictString}}', () => {
  test('success, value is {{strictString}}', () => {
    const sut = new TextStrictEqualValidationRule('aaabbb');
    const result = sut.validate('aaabbb');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('failure, value not equal to {{strictString}}', () => {
    const sut = new TextStrictEqualValidationRule('aaabbb');
    const result = sut.validate('bbbaaa');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Значение должно быть {{strictString}}',
      },
    });
  });

  test('failure, value not equal to {{strictString}}', () => {
    const sut = new TextStrictEqualValidationRule('aaabbb');
    const result = sut.validate('aaa-bbb');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Значение должно быть {{strictString}}',
      },
    });
  });
});
