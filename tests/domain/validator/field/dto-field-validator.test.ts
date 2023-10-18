/* eslint-disable function-paren-newline */
import { describe, expect, test } from 'bun:test';
import { FieldValidatorPrivateFixtures as FieldValidatorFixtures } from './test-fixtures';
import { DtoFieldValidator } from '../../../../src/domain/validator/field-validator/dto-field-validator';
import { DTO } from '../../../../src/domain/dto';
import { CannotBeUndefinedValidationRule } from '../../../../src/domain/validator/rules/assert-rules/cannot-be-undefined.a-rule';
import { CanBeNullValidationRule } from '../../../../src/domain/validator/rules/nullable-rules/can-be-only-null.n-rule';
import { ValidationRule } from '../../../../src/domain/validator/rules/validation-rule';
import { CanBeUndefinedValidationRule } from '../../../../src/domain/validator/rules/nullable-rules/can-be-only-undefined.n-rule';
import { CannotBeNullValidationRule } from '../../../../src/domain/validator/rules/assert-rules/cannot-be-null.a-rule';

describe('DTO Tests', () => {
  describe('Test cases when is not array dto', () => {
    describe('Test cases when is not array and attributes are required', () => {
      const sut = new DtoFieldValidator(
        'phones', true, { isArray: false }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap,
      );

      test('Success, a valid value has arrived', () => {
        const result = sut.validate(
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
        );
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toEqual(undefined);
      });

      test('Failure, one of the attributes is not a valid value', () => {
        const result = sut.validate(
          { number: '+7-555-879-11-02', type: 'mobil', noOutField: 'info' },
        );
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          phones: {
            type: [
              {
                text: 'Значение должно быть одним из значений списка',
                hint: { choices: ['mobile', 'work'] },
              },
            ],
          },
        });
      });

      test('Failure, several attributes are not valid', () => {
        const result = sut.validate(
          { number: '+7-555-879-11-02', type: 'mobil' },
        );
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          phones: {
            noOutField: [
              {
                hint: {},
                text: 'Значение не должно быть undefined или null',
              },
            ],
            type: [
              {
                text: 'Значение должно быть одним из значений списка',
                hint: { choices: ['mobile', 'work'] },
              },
            ],
          },
        });
      });

      test('Failure, literal value together with dto', () => {
        const result = sut.validate('some literal value');
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___dto_whole_value_validation_error___: [
            {
              text: 'Значение должно быть объектом',
              hint: {},
            },
          ],
        });
      });

      test('Failure, came undefined, null instead of dto object', () => {
        const valuesToCheck = [undefined, null];
        valuesToCheck.forEach((value) => {
          const result = sut.validate(value);
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            ___dto_whole_value_validation_error___: [
              {
                text: 'Значение не должно быть undefined или null',
                hint: {},
              },
            ],
          });
        });
      });

      test('Failure, came an array of objects together dto object', () => {
        const result = sut.validate([
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
          { number: '+7-555-879-24-02', type: 'work', noOutField: 'info' },
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___dto_whole_value_validation_error___: [
            {
              text: 'Значение должно быть объектом',
              hint: {},
            },
          ],
        });
      });

      describe('value required, but null available cases', () => {
        class RequiredButCanBeNullValidator extends DtoFieldValidator<'phones', true, false, DTO> {
          protected getRequiredOrNullableRules(): Array<
          ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>
          > {
            return [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()];
          }
        }
        const sutRequired = new RequiredButCanBeNullValidator(
          'phones', true, { isArray: false }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap,
        );

        test('Success, a valid value has arrived', () => {
          const result = sutRequired.validate(
            { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
          );
          expect(result.isSuccess()).toBe(true);
          expect(result.value).toBe(undefined);
        });

        test('Success, received null', () => {
          const result = sutRequired.validate(null);
          expect(result.isSuccess()).toBe(true);
          expect(result.value).toBe(undefined);
        });

        test('Failure, dto arrived with errors in attributes', () => {
          const result = sutRequired.validate(
            { number: '+7-777-287-81-82', type: 'mobile' },
          );
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            phones: {
              noOutField: [
                {
                  text: 'Значение не должно быть undefined или null',
                  hint: {},
                },
              ],
            },
          });
        });

        test('Failure, arrived undefined', () => {
          const result = sutRequired.validate(undefined);
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            ___dto_whole_value_validation_error___: [
              {
                text: 'Значение не должно быть undefined',
                hint: {},
              },
            ],
          });
        });
      });
    });

    describe('Test cases when is not array and attributes are not required', () => {
      const sut = new DtoFieldValidator(
        'phones', false, { isArray: false }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap,
      );

      test('Success, a valid value has arrived', () => {
        const result = sut.validate(
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
        );
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(undefined);
      });

      test('Success, together the value came undefined null', () => {
        const valuesToCheck = [undefined, null];
        valuesToCheck.forEach((value) => {
          const result = sut.validate(value);
          expect(result.isSuccess()).toBe(true);
          expect(result.value).toBe(undefined);
        });
      });

      test('Failure, one of the attributes is not a valid value', () => {
        const result = sut.validate(
          { number: '+7-555-879-11-02', type: 'mobil', noOutField: 'info' },
        );
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          phones: {
            type: [
              {
                text: 'Значение должно быть одним из значений списка',
                hint: { choices: ['mobile', 'work'] },
              },
            ],
          },
        });
      });

      test('Failure, several attributes are not valid', () => {
        const result = sut.validate(
          { number: '+7-555-879-11-02', type: 5454, noOutField: undefined },
        );
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          phones: {
            noOutField: [
              {
                hint: {},
                text: 'Значение не должно быть undefined или null',
              },
            ],
            type: [
              {
                text: 'Значение должно быть строковым значением',
                hint: {},
              },
            ],
          },
        });
      });

      test('Failure, instead of the dto object a literal value was received', () => {
        const result = sut.validate(2);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___dto_whole_value_validation_error___: [
            {
              text: 'Значение должно быть объектом',
              hint: {},
            },
          ],
        });
      });

      test('Failure, DTO array arrived', () => {
        const result = sut.validate([
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
          { number: '+7-555-879-24-02', type: 'work', noOutField: 'info' },
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___dto_whole_value_validation_error___: [
            {
              text: 'Значение должно быть объектом',
              hint: {},
            },
          ],
        });
      });

      describe('value is not required, but null not valid cases', () => {
        class NotRequiredButNullValidValidator extends DtoFieldValidator<'phones', false, false, DTO> {
          protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
            return [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()];
          }
        }
        const sutNotRequired = new NotRequiredButNullValidValidator(
          'phones', false, { isArray: false }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap,
        );

        test('Success, valid value arrived', () => {
          const result = sutNotRequired.validate(
            { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
          );
          expect(result.isSuccess()).toBe(true);
          expect(result.value).toBe(undefined);
        });

        test('Success, came null value', () => {
          const result = sutNotRequired.validate(null);
          expect(result.isSuccess()).toBe(true);
          expect(result.value).toBe(undefined);
        });

        test('Failure, dto arrived with errors in attributes', () => {
          const result = sutNotRequired.validate(
            { number: '+7-777-287-81-82', type: 'mobile', noOutField: 3 },
          );
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            phones: {
              noOutField: [
                {
                  text: 'Значение должно быть строковым значением',
                  hint: {},
                },
              ],
            },
          });
        });

        test('Failure, came undefined value', () => {
          const result = sutNotRequired.validate(undefined);
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            ___dto_whole_value_validation_error___: [
              {
                text: 'Значение не должно быть undefined',
                hint: {},
              },
            ],
          });
        });
      });
    });
  });

  describe('Test cases when array dto', () => {
    describe('Test cases when required array dto', () => {
      const sut = new DtoFieldValidator(
        'phones', true, { isArray: true }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap,
      );

      test('Success, a valid data array arrived from dto', () => {
        const result = sut.validate([
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
          { number: '+7-555-879-24-02', type: 'work', noOutField: 'info' },
        ]);
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(undefined);
      });

      test('Failure, came as undefined and null', () => {
        const valuesToCheck = [undefined, null];
        valuesToCheck.forEach((value) => {
          const result = sut.validate(value);
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            ___array_whole_value_validation_error___: [
              {
                text: 'Значение не должно быть undefined или null',
                hint: {},
              },
            ],
          });
        });
      });

      test('Failure, a regular dto object arrived', () => {
        const result = sut.validate(
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
        );
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___array_whole_value_validation_error___: [
            {
              text: 'Значение должно быть массивом данных',
              hint: {},
            },
          ],
        });
      });

      test('Failure, an one dto of array arrived with errors', () => {
        const result = sut.validate([
          { number: '+7-555-879-11-02', type: 'mobil', noOutField: 'info' },
          { number: '+7-555-879-24-02', type: 'mobile', noOutField: 'info' },
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          0: {
            phones: {
              type: [
                {
                  text: 'Значение должно быть одним из значений списка',
                  hint: { choices: ['mobile', 'work'] },
                },
              ],
            },
          },
        });
      });

      test('Failure, an array arrived with several errors ', () => {
        const result = sut.validate([
          { number: '+7-555-879-11-02', type: 'mobil', noOutField: true },
          { number: '+7-555-879-24-022', type: 'mobile', noOutField: 'info' },
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          0: {
            phones: {
              type: [
                {
                  text: 'Значение должно быть одним из значений списка',
                  hint: { choices: ['mobile', 'work'] },
                },
              ],
              noOutField: [
                {
                  hint: {},
                  text: 'Значение должно быть строковым значением',
                },
              ],
            },
          },
          1: {
            phones: {
              number: [
                {
                  text: 'Строка должна соответствовать формату: "+7-###-##-##"',
                  hint: {},
                },
                {
                  text: 'Строка должна быть равна {{count}}, сейчас {{current}}',
                  hint: {
                    count: 16,
                    current: 17,
                  },
                },
              ],
            },
          },
        });
      });

      test('Failure, a data array with a literal value arrived', () => {
        const result = sut.validate([
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
          'some literal value',
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          1: {
            ___dto_whole_value_validation_error___: [
              {
                text: 'Значение должно быть объектом',
                hint: {},
              },
            ],
          },
        });
      });

      describe('value is not required, but null not valid cases', () => {
        class NotRequiredButNullNotValidValidator extends DtoFieldValidator< 'phones', true, true, DTO> {
          protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
            return [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()];
          }
        }
        const sutNotRequired = new NotRequiredButNullNotValidValidator(
          'phones', true, { isArray: true }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap,
        );

        test('Success, valid value arrived', () => {
          const result = sutNotRequired.validate([
            { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
            { number: '+7-777-287-24-82', type: 'mobile', noOutField: 'empty info' },
          ]);
          expect(result.isSuccess()).toBe(true);
          expect(result.value).toBe(undefined);
        });

        test('Success, came as null', () => {
          const result = sutNotRequired.validate(null);
          expect(result.isSuccess()).toBe(true);
          expect(result.value).toBe(undefined);
        });

        test('Failure, dto arrived with errors in attributes', () => {
          const result = sutNotRequired.validate([
            { number: '+7-777-287-81-82', type: 'mobil' },
            { number: '+7-777-287-24-82', type: 'mobile', noOutField: 'empty info' },
          ]);
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            0: {
              phones: {
                type: [
                  {
                    text: 'Значение должно быть одним из значений списка',
                    hint: { choices: ['mobile', 'work'] },
                  },
                ],
                noOutField: [
                  {
                    text: 'Значение не должно быть undefined или null',
                    hint: {},
                  },
                ],
              },
            },
          });
        });

        test('Failure, came as undefined value ', () => {
          const result = sutNotRequired.validate(undefined);
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            ___array_whole_value_validation_error___: [
              {
                text: 'Значение не должно быть undefined',
                hint: {},
              },
            ],
          });
        });

        test('Failure, one of the elements is not a dto object ', () => {
          const result = sutNotRequired.validate([
            'some not dto literal value',
            { number: '+7-777-287-81-82', type: 'mobile' },
          ]);
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            0: {
              ___dto_whole_value_validation_error___: [
                {
                  text: 'Значение должно быть объектом',
                  hint: {},
                },
              ],
            },
            1: {
              phones: {
                noOutField: [
                  {
                    text: 'Значение не должно быть undefined или null',
                    hint: {},
                  },
                ],
              },
            },
          });
        });
      });
    });

    describe('Test cases when array not required dto', () => {
      const sut = new DtoFieldValidator(
        'phones', false, { isArray: true }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap,
      );

      test('Success, arrived valid value', () => {
        const result = sut.validate([
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
          { number: '+7-555-879-24-02', type: 'work', noOutField: 'info' },
        ]);
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(undefined);
      });

      test('Success, came as undefined and null value', () => {
        const valuesToCheck = [undefined, null];
        valuesToCheck.forEach((value) => {
          const result = sut.validate(value);
          expect(result.isSuccess()).toBe(true);
          expect(result.value).toBe(undefined);
        });
      });

      test('Failure, a simple dto object arrived instead of an array with data', () => {
        const result = sut.validate(
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
        );
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___array_whole_value_validation_error___: [
            {
              text: 'Значение должно быть массивом данных',
              hint: {},
            },
          ],
        });
      });

      test('Failure, an array arrived with errors in the attributes', () => {
        const result = sut.validate([
          { number: '+7-555-879-11-02', type: 'mobil', noOutField: 'info' },
          { number: '+7-555-879-24-02', type: 'mobile', noOutField: 'info' },
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          0: {
            phones: {
              type: [
                {
                  text: 'Значение должно быть одним из значений списка',
                  hint: { choices: ['mobile', 'work'] },
                },
              ],
            },
          },
        });
      });

      test('Failure, an array arrived with several errors', () => {
        const result = sut.validate([
          { number: '+7-555-879-11-02', type: 'mobil' },
          { number: '+7-555-879-24-02', type: 'mobile', noOutField: 'info' },
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          0: {
            phones: {
              noOutField: [
                {
                  hint: {},
                  text: 'Значение не должно быть undefined или null',
                },
              ],
              type: [
                {
                  text: 'Значение должно быть одним из значений списка',
                  hint: { choices: ['mobile', 'work'] },
                },
              ],
            },
          },
        });
      });

      test('Failure, an array of data was received with errors in the attributes in both arrays', () => {
        const result = sut.validate([
          { number: '+7-555-879-11-02', type: 'mobil', noOutField: 'info' },
          { number: '+7-555-879-24-02', type: 'mobile', noOutField: true },
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          0: {
            phones: {
              type: [
                {
                  text: 'Значение должно быть одним из значений списка',
                  hint: { choices: ['mobile', 'work'] },
                },
              ],
            },
          },
          1: {
            phones: {
              noOutField: [
                {
                  text: 'Значение должно быть строковым значением',
                  hint: {},
                },
              ],
            },
          },
        });
      });

      test('Failure, a data array has arrived where one of the elements has a literal value', () => {
        const result = sut.validate([
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
          'some literal value',
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          1: {
            ___dto_whole_value_validation_error___: [
              {
                text: 'Значение должно быть объектом',
                hint: {},
              },
            ],
          },
        });
      });

      describe('not required dto, but null not valid value', () => {
        class NotRequiredDtoValidator extends DtoFieldValidator< 'phones', false, true, DTO> {
          protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
            return [new CanBeUndefinedValidationRule(), new CannotBeNullValidationRule()];
          }
        }
        const sutNotRequired = new NotRequiredDtoValidator(
          'phones', false, { isArray: true }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap,
        );

        test('Success, valid value arrived', () => {
          const result = sutNotRequired.validate([
            { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
            { number: '+7-777-287-24-82', type: 'mobile', noOutField: 'empty info' },
          ]);
          expect(result.isSuccess()).toBe(true);
          expect(result.value).toBe(undefined);
        });

        test('Success, came as undefined value', () => {
          const result = sutNotRequired.validate(undefined);
          expect(result.isSuccess()).toBe(true);
        });

        test('Failure, null is not valid', () => {
          const result = sutNotRequired.validate(null);
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            ___array_whole_value_validation_error___: [
              {
                text: 'Значение не может быть равным null',
                hint: {},
              },
            ],
          });
        });

        test('Failure, an array arrived with errors in the attributes', () => {
          const result = sutNotRequired.validate([
            { number: '+7-777-287-81-82', type: 'mobile' },
            { number: '+7-777-287-24-82', type: 'mobile', noOutField: 'empty info' },
          ]);
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            0: {
              phones: {
                noOutField: [
                  {
                    text: 'Значение не должно быть undefined или null',
                    hint: {},
                  },
                ],
              },
            },
          });
        });

        test('Failure, one of the elements is not a dto object', () => {
          const result = sutNotRequired.validate([
            'some literal value',
            { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
          ]);
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            0: {
              ___dto_whole_value_validation_error___: [
                {
                  text: 'Значение должно быть объектом',
                  hint: {},
                },
              ],
            },
          });
        });
      });
    });
  });
});
