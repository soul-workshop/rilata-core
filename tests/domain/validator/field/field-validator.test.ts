import { DtoFieldValidator } from '../../../../src/domain/validator/field-validator/dto-field-validator';
import { DtoFieldErrors } from '../../../../src/domain/validator/field-validator/types';
import { RuleError } from '../../../../src/domain/validator/rules/types';
import { ValidationRule } from '../../../../src/domain/validator/rules/validation-rule';
import { FieldValidatorPrivateFixtures as FieldValidatorFixtures, FieldValidatorTestMocksPrivateFixtures as ValidatorMocksFixtures } from './test-fixtures';

describe('number validator with range value rule', () => {
  const sut = new FieldValidatorFixtures.PersonIsWorkAgeFieldValidator('man');
  sut.init('ageField', ValidatorMocksFixtures.getLoggerMock());

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
          requirement: 'Возраст должен быть между {{min}} и {{max}}',
          ruleHint: { max: 65, min: 18 },
        }],
      });
    });

    test('fail, value is required', () => {
      const result = sut.validate(undefined);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        ageField: [{
          requirement: 'Значение не должно быть undefined или null',
          ruleHint: {},
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
      const recievedString = ValidationRule.rawToMessage(dtoErrors.ageField[0]);
      expect(recievedString).toBe(expectedError);
    });
  });
});

describe('dto validator tests', () => {
  const sut = new FieldValidatorFixtures.AddPersonCommandValidator();
  sut.init(
    DtoFieldValidator.WHOLE_VALUE_VALIDATION_ERROR_KEY,
    ValidatorMocksFixtures.getLoggerMock(),
  );

  test('success dto validate', () => {
    const result = sut.validate(FieldValidatorFixtures.addPersonCommand);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toBe(true);
  });

  test('success, test leadRule worked', () => {
    const validatedData = FieldValidatorFixtures.addPersonCommand;
    const phone = validatedData.contacts.phones[0];
    phone.number = `\t${phone.number} `;
    const result = sut.validate(validatedData);
    expect(result.isSuccess()).toBe(true);
  });
});
