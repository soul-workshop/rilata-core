import { describe, expect, test } from 'bun:test';
import { FieldErrors } from '../../../../src/domain/validator/field-validator/types';
import { RuleError } from '../../../../src/domain/validator/rules/types';
import { ValidationRule } from '../../../../src/domain/validator/rules/validation-rule';
import { FieldValidatorPrivateFixtures as FieldValidatorFixtures } from './test-fixtures';

describe('number validator with range value rule', () => {
  const sut = new FieldValidatorFixtures.PersonIsWorkAgeFieldValidator('ageField', 'man');

  describe('base validate tests', () => {
    test('success case', () => {
      const answer = sut.validate(25);
      expect(answer.isSuccess()).toBe(true);
    });

    test('fail, value less a min requirement', () => {
      const result = sut.validate(15);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        ageField: [{
          text: 'Возраст должен быть между {{min}} и {{max}}',
          name: 'RangeNumberValidationRule',
          hint: { max: 65, min: 18 },
        }],
      });
    });
  });

  describe('test comppile error text by rule hint', () => {
    test('success compiled by two parameter', () => {
      const result = sut.validate(15);
      expect(result.isFailure()).toBe(true);
      const dtoErrors = result.value as FieldErrors;
      expect(Array.isArray(dtoErrors.ageField)).toBe(true);
      expect((dtoErrors.ageField as RuleError[]).length).toBe(1);
      const expectedError = 'Возраст должен быть между 18 и 65';
      const recievedString = ValidationRule.rawToMessage((dtoErrors.ageField as RuleError[])[0]);
      expect(recievedString).toBe(expectedError);
    });
  });
});

describe('dto validator tests', () => {
  const sut = new FieldValidatorFixtures.AddPersonCommandValidator();

  test('success dto validate', () => {
    const result = sut.validate(FieldValidatorFixtures.addPersonCommand);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toBeUndefined();
  });
});
