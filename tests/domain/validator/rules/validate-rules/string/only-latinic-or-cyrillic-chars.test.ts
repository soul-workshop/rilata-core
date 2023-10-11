import { describe, expect, test } from 'bun:test';
import { OnlyLitinicOrCyrillicCharsValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/only-latinic-or-cyrillic-chars';

describe('The string must contain only Cyrillic and Latin alphabet', () => {
  const sut = new OnlyLitinicOrCyrillicCharsValidationRule();
  test('success, there are no prohibited languages in the string', () => {
    const result = sut.validate('Latinic');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, there are no prohibited languages in the string', () => {
    const result = sut.validate('Кирилица');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, numbers allowed', () => {
    const result = sut.validate('1234567890');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'В строке может быть только латиница и кирилица',
      },
    });
  });

  test('failure, prohibited languages in string', () => {
    const result = sut.validate('中國人'); // Китайский
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'В строке может быть только латиница и кирилица',
      },
    });
  });

  test('failure, prohibited languages in string', () => {
    const result = sut.validate('κρουασάν'); // Греческий
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'В строке может быть только латиница и кирилица',
      },
    });
  });

  test('failure, only Latin or Cyrillic', () => {
    const result = sut.validate(' English or Русский ');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'В строке может быть только латиница и кирилица',
      },
    });
  });

  test('failure, only Latin or Cyrillic', () => {
    const result = sut.validate('!"№;%:?*()');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'В строке может быть только латиница и кирилица',
      },
    });
  });
});
