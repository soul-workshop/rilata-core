import { describe, expect, test } from 'bun:test';
import { EmailFormatValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/email-format.field-v-rule';

describe('The string must match the email format', () => {
  test('success, the resulting value is correlated with the email form', () => {
    const sut = new EmailFormatValidationRule();
    const result = sut.validate('example@email.com');
    expect(result).toEqual({ behaviour: 'RunNextRule' });
  });

  test('success, received string type value', () => {
    
  });
});
