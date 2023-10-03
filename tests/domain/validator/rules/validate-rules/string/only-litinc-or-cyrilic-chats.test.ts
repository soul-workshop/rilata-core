import { describe, expect, test } from 'bun:test';
import { OnlyLitinicOrCyrillicCharsValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/only-litinic-or-cyrillic-chars';

describe('', () => {
  test('', () => {
    const sut = new OnlyLitinicOrCyrillicCharsValidationRule();
    const result = sut.validate(' English or Рус ский ');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('', () => {
    const sut = new OnlyLitinicOrCyrillicCharsValidationRule();
    const result = sut.validate('12345 988 ');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('', () => {
    const sut = new OnlyLitinicOrCyrillicCharsValidationRule();
    const result = sut.validate('中國人'); // Китайский
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Только латиница и кирилица',
      },
    });
  });

  test('', () => {
    const sut = new OnlyLitinicOrCyrillicCharsValidationRule();
    const result = sut.validate('κρουασάν'); // Греческий
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Только латиница и кирилица',
      },
    });
  });

  test('', () => {
    const sut = new OnlyLitinicOrCyrillicCharsValidationRule();
    const result = sut.validate('!"№;%:?*()');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Только латиница и кирилица',
      },
    });
  });
});
