import { describe, expect, test } from 'bun:test';
import { RegexDoesntMatchValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/regex-doesnt-match-value.field-v-rule';

describe('Validating strings using regular expressions', () => {
  test('succes, ИИН is valid', () => {
    const sut = new RegexDoesntMatchValidationRule(/^[0-9]\d{11}$/, 'Введите ИИН (12 цифр) ');
    const result = sut.validate('0106255307');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('failure, incorrect phone number entered', () => {
    const sut = new RegexDoesntMatchValidationRule(/^(?!.*test)[ a-zA-Z]+$/, 'Должно присутствовать слово test');
    const result = sut.validate('text have word test');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('The text should not end with the word world', () => {
    const sut = new RegexDoesntMatchValidationRule(/stairs/, 'В тексте не должно присутствовать слово stairs');
    const result = sut.validate('there were only steps in the house');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('The text should not end with the word world', () => {
    const sut = new RegexDoesntMatchValidationRule(/world$/, 'Текст не должен заканчиваться на слово world');
    const result = sut.validate('Hello world moon');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('The text should not end with the word world', () => {
    const sut = new RegexDoesntMatchValidationRule(/world$/, 'Текст не должен заканчиваться на слово world');
    const result = sut.validate('Hello world');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Текст не должен заканчиваться на слово world',
      },
    });
  });
  test('The text should not end with the word world', () => {
    const sut = new RegexDoesntMatchValidationRule(/stairs/, 'В тексте не должно присутствовать слово stairs');
    const result = sut.validate('there was a stairs in the house');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'В тексте не должно присутствовать слово stairs',
      },
    });
  });
  test('failure, IIN is invalid', () => {
    const sut = new RegexDoesntMatchValidationRule(/^[0-9]\d{11}$/, 'Введите ИИН (12 цифр) ');
    const result = sut.validate('010625530759');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Введите ИИН (12 цифр) ',
      },
    });
  });
  test('failure, incorrect phone number entered', () => {
    const sut = new RegexDoesntMatchValidationRule(/^(?!.*test)[ a-zA-Z]+$/, 'Должно присутствовать слово test');
    const result = sut.validate('some text');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Должно присутствовать слово test',
      },
    });
  });
});
