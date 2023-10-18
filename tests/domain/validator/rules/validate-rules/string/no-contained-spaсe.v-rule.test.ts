import { describe, expect, test } from 'bun:test';
import { NoContanedSpaсeValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/no-contained-space.v-rule';

describe('There should be no spaces in the string', () => {
  const sut = new NoContanedSpaсeValidationRule();
  test('success, there are no spaces in the string', () => {
    const result = sut.validate('StringWithoutSpaces');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('failed, line contains Enter', () => {
    const result = sut.validate(`string${String.fromCharCode(10)}WithNewLine`);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Не должно быть пробелов',
      },
    });
  });

  test('failed, line contains vertical tab', () => {
    const result = sut.validate(`string${String.fromCharCode(11)}WithVerticalTab`);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Не должно быть пробелов',
      },
    });
  });

  test('failed, string contains spaces', () => {
    const result = sut.validate('String have spaces');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Не должно быть пробелов',
      },
    });
  });

  test('failed, string contains tab spaces', () => {
    // eslint-disable-next-line no-tabs
    const result = sut.validate('string		WithTab');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Не должно быть пробелов',
      },
    });
  });
});
