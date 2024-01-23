import { describe, expect, test } from 'bun:test';
import { StringChoiceValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/string-choice.v-rule';

describe('Value must be one of the list results', () => {
  test('success, value is in the list', () => {
    const sut = new StringChoiceValidationRule(['Sagyndyk', 'Islyam']);
    const result = sut.validate('Sagyndyk');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('failure, value is not in the list', () => {
    const sut = new StringChoiceValidationRule(['Sagyndyk', 'Islyam']);
    const result = sut.validate('Renat');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {
          choices: [
            'Sagyndyk',
            'Islyam',
          ],
        },
        name: 'StringChoiceValidationRule',
        text: 'Значение должно быть одним из значений списка',
      },
    });
  });
});
