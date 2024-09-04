import { describe, expect, test } from 'bun:test';
import { RegexDoesntMatchValidationRule } from './regex-doesnt-match-value.field-v-rule.ts';

describe('Validating strings using regular expressions', () => {
  test('success, the word stairs is not present in the text', () => {
    const sut = new RegexDoesntMatchValidationRule(/stairs/, 'В тексте не должно присутствовать слово stairs');
    const result = sut.validate('there were only steps in the house');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('success, the text ends with the word world', () => {
    const sut = new RegexDoesntMatchValidationRule(/world$/, 'Текст не должен заканчиваться на слово world');
    const result = sut.validate('Hello world moon');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('success, text does not contain numbers', () => {
    const sut = new RegexDoesntMatchValidationRule(/[0-9]/, 'Текст не должен содержать цифр');
    const result = sut.validate('Hello world ten moon');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('failure, the text ends with the word world', () => {
    const sut = new RegexDoesntMatchValidationRule(/world$/, 'Текст не должен заканчиваться на слово world');
    const result = sut.validate('Hello world');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        name: 'RegexDoesntMatchValidationRule',
        text: 'Текст не должен заканчиваться на слово world',
      },
    });
  });
  test('failure, the word stairs is present in the text', () => {
    const sut = new RegexDoesntMatchValidationRule(/stairs/, 'В тексте не должно присутствовать слово stairs');
    const result = sut.validate('there was a stairs in the house');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        name: 'RegexDoesntMatchValidationRule',
        text: 'В тексте не должно присутствовать слово stairs',
      },
    });
  });
  test('failure, text contains numbers', () => {
    const sut = new RegexDoesntMatchValidationRule(/[0-9]/, 'Текст не должен содержать цифр');
    const result = sut.validate('Hello world 10 moon');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        name: 'RegexDoesntMatchValidationRule',
        text: 'Текст не должен содержать цифр',
      },
    });
  });
});
