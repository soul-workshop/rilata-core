import { describe, expect, test } from 'bun:test';
import { TextStrictEqualValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/text-strict-equal.v-rule';

describe('String Equality Checks', () => {
  test('success, value is {{strictString}}', () => {
    const sut = new TextStrictEqualValidationRule('aaabbb');
    const result = sut.validate('aaabbb');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('failure, value not equal to {{strictString}}', () => {
    const sut = new TextStrictEqualValidationRule('Aaabbb');
    const result = sut.validate('bbbaaa');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { strictString: 'Aaabbb' },
        text: 'Строка должна быть строго равна "{{strictString}}"',
      },
    });
  });

  test('failure, value not equal to {{strictString}}', () => {
    const sut = new TextStrictEqualValidationRule('aaabbb');
    const result = sut.validate('aaa-bbb');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { strictString: 'aaabbb' },
        text: 'Строка должна быть строго равна "{{strictString}}"',
      },
    });
  });
});
