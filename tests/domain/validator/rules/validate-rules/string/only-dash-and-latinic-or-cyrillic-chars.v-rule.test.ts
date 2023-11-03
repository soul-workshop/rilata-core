import { describe, test, expect } from 'bun:test';
import { OnlyDashAndLitinicOrCyrillicCharsValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/only-dash-and-latinic-or-cyrillic-chars.v-rule';

describe('The string must contain only Cyrillic and Latin alphabet', () => {
  const sut = new OnlyDashAndLitinicOrCyrillicCharsValidationRule();
  test('success, there are no prohibited languages in the string', () => {
    const result = sut.validate('Latinic');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('success, there are no prohibited languages in the string', () => {
    const result = sut.validate('Кирилица');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('failure, only Latin or Cyrillic', () => {
    const result = sut.validate('Nurbolat-Amangaliev');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('failure, string with 1 digit symbol', () => {
    const result = sut.validate('1234567890');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не должна содержать символы кроме "-"(дефис) и может содержать слова только на латинице или на кирилице.',
      },
    });
  });

  test('failure, prohibited languages in string', () => {
    const result = sut.validate('中國人'); // Китайский
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не должна содержать символы кроме "-"(дефис) и может содержать слова только на латинице или на кирилице.',
      },
    });
  });

  test('failure, prohibited languages in string', () => {
    const result = sut.validate('κρουασάν'); // Греческий
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не должна содержать символы кроме "-"(дефис) и может содержать слова только на латинице или на кирилице.',
      },
    });
  });

  test('failure, only Latin or Cyrillic', () => {
    const result = sut.validate(' English and space ');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не должна содержать символы кроме "-"(дефис) и может содержать слова только на латинице или на кирилице.',
      },
    });
  });

  test('failure, only Latin or Cyrillic', () => {
    const result = sut.validate('Nurbолат');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не должна содержать символы кроме "-"(дефис) и может содержать слова только на латинице или на кирилице.',
      },
    });
  });

  test('failure, only Latin or Cyrillic', () => {
    const result = sut.validate('Nurbolat@$#^');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не должна содержать символы кроме "-"(дефис) и может содержать слова только на латинице или на кирилице.',
      },
    });
  });
});
