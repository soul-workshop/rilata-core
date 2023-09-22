import { describe, expect, test } from 'bun:test';
import { DtoFieldErrors } from '../../../../src/domain/validator/field-validator/types';
import { RuleError } from '../../../../src/domain/validator/rules/types';
import { ValidationRule } from '../../../../src/domain/validator/rules/validation-rule';
import { FieldValidatorPrivateFixtures as FieldValidatorFixtures } from './test-fixtures';
import { DODPrivateFixtures } from '../../../dod-private-fixtures';

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
          hint: { max: 65, min: 18 },
        }],
      });
    });
  });

  describe('test comppile error text by rule hint', () => {
    test('success compiled by two parameter', () => {
      const result = sut.validate(15);
      expect(result.isFailure()).toBe(true);
      const dtoErrors = result.value as DtoFieldErrors;
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
    expect(result.value).toBe(undefined);
  });

  test('success, test leadRule worked', () => {
    const validatedData = FieldValidatorFixtures.addPersonCommand;
    const phone = validatedData.contacts.phones[0];
    phone.number = `\t${phone.number} `;
    const result = sut.validate(validatedData);
    expect(result.isSuccess()).toBe(true);
  });
});

describe('array validate', () => {
  const sut = FieldValidatorFixtures.contactAttrsValidatormap.phones;

  test('success', () => {
    const result = sut.validate([{ number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' }]);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toBe(undefined);
  });

  test('failure', () => {
    const validateData = [{ number: '+7-777-287-81-82', type: 'mobile' }];
    const result = sut.validate(validateData);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      phones: {
        0: {
          noOutField: [
            {
              text: 'Значение не должно быть undefined или null',
              hint: {},
            }],
        },
      },
    });
  });

  test('failure, the value must be an array of data', () => {
    const result = sut.validate('r');
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      phones: [
        {
          hint: {},
          text: 'Значение должно быть массивом данных',
        },
      ],
    });
  });
  test('failure, the value must be one of the values in the list', () => {
    const result = sut.validate([{ number: '+7-777-287-81-82', type: 'block', noOutField: 'empty info' }]);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      phones: {
        0: {
          type: [
            {
              hint: {
                choices: [
                  'mobile',
                  'work',
                ],
              },
              text: 'Значение должно быть одним из значений списка',
            },
          ],
        },
      },
    });
  });
});
