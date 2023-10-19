import { describe, expect, test } from 'bun:test';
import { NoContainedCharsValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/no-contained-chars..v-rule';

describe('String must not be equal to value', () => {
  test('success, the string does not contain illegal characters', () => {
    const sut = new NoContainedCharsValidationRule('5678');
    const result = sut.validate('123490');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('success, the string does not contain illegal characters', () => {
    const sut = new NoContainedCharsValidationRule('#!&?');
    const result = sut.validate('petrop076gmail.com');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('success, the string does not contain illegal characters', () => {
    const sut = new NoContainedCharsValidationRule('1234567890');
    const result = sut.validate('without any digit string');
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('failure, string contains invalid characters', () => {
    const sut = new NoContainedCharsValidationRule('#!&?');
    const result = sut.validate('petrop#076@gmail.com');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { noChars: '#!&?' },
        text: 'Строка не должна содержать символы {{noChars}}',
      },
    });
  });

  test('failure, string contains invalid characters', () => {
    const sut = new NoContainedCharsValidationRule('1234567890');
    const result = sut.validate('1 number have');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { noChars: '1234567890' },
        text: 'Строка не должна содержать символы {{noChars}}',
      },
    });
  });

  test('провал, в ошибку успешно передается текст переданный в конструктор', () => {
    const sut = new NoContainedCharsValidationRule(' ', 'Строка не должна содержать пробел');
    const result = sut.validate('1 number have');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: { noChars: ' ' },
        text: 'Строка не должна содержать пробел',
      },
    });
  });
});
