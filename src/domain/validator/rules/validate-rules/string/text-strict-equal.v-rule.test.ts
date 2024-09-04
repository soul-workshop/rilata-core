import { describe, expect, test } from 'bun:test';
import { TextStrictEqualValidationRule } from './text-strict-equal.v-rule.ts';

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
        name: 'TextStrictEqualValidationRule',
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
        name: 'TextStrictEqualValidationRule',
        text: 'Строка должна быть строго равна "{{strictString}}"',
      },
    });
  });
});
