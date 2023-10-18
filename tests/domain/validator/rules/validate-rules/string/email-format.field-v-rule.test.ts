import { describe, expect, test } from 'bun:test';
import { EmailFormatValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/email-format.field-v-rule';

describe('String must match the email format', () => {
  test('success, the resulting value is correlated with the email form', () => {
    const sut = new EmailFormatValidationRule();
    const result = sut.validate('example@email.com');
    expect(result).toEqual({ behaviour: 'SuccessRunNextRule' });
  });

  test('failure, when there is no dog in email format', () => {
    const sut = new EmailFormatValidationRule();
    const result = sut.validate('example-email.com');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не соответствует формату электронной почты',
      },
    });
  });
  test('failure, no email domain', () => {
    const sut = new EmailFormatValidationRule();
    const result = sut.validate('example@emailcom');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не соответствует формату электронной почты',
      },
    });
  });
  test('failure, special characters are not accepted in the email title', () => {
    const sut = new EmailFormatValidationRule();
    const result = sut.validate(';example@email.com');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Строка не соответствует формату электронной почты',
      },
    });
  });
});
