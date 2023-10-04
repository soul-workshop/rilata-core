import { describe, expect, test } from 'bun:test';
import { NoContanedSpaseValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/no-contained-space.v-rule';

describe('There should be no spaces in the string', () => {
  const sut = new NoContanedSpaseValidationRule();
  test('success, there are no spaces in the string', () => {
    const result = sut.validate('StringWithoutSpaces');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
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
});
