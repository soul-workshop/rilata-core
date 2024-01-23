import { describe, expect, test } from 'bun:test';
import { ValidationRule } from '../../../../src/domain/validator/rules/validation-rule';
import { LiteralFieldValidator } from '../../../../src/domain/validator/field-validator/literal-field-validator';
import { StringChoiceValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/string-choice.v-rule';
import { CannotBeUndefinedValidationRule } from '../../../../src/domain/validator/rules/assert-rules/cannot-be-undefined.a-rule';
import { CanBeNullValidationRule } from '../../../../src/domain/validator/rules/nullable-rules/can-be-only-null.n-rule';
import { CannotBeNullValidationRule } from '../../../../src/domain/validator/rules/assert-rules/cannot-be-null.a-rule';
import { CanBeUndefinedValidationRule } from '../../../../src/domain/validator/rules/nullable-rules/can-be-only-undefined.n-rule';

describe('тесты литерального валидатора принимающего массив данных', () => {
  describe('Валидированное значение обязательно', () => {
    test(' успех, пришло валидное значение', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate(['admin']);
      expect(res.isSuccess()).toBe(true);
      expect(res.value).toBeUndefined();
    });

    test(' успех, пришло валидное значение', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate(['admin', 'staffManager']);
      expect(res.isSuccess()).toBe(true);
      expect(res.value).toBeUndefined();
    });

    test(' успех, пришло пустой массив', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate([]);
      expect(res.isSuccess()).toBe(true);
      expect(res.value).toBeUndefined();
    });

    test(' провал, пришло undefined, null', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const valuesToTest = [undefined, null];
      valuesToTest.forEach((value) => {
        const res = sut.validate(value);
        expect(res.isFailure()).toBe(true);
        expect(res.value).toEqual({
          ___array_whole_value_validation_error___: [
            {
              text: 'Значение не должно быть undefined или null',
              name: 'CannotBeNullableAssertionRule',
              hint: {},
            },
          ],
        });
      });
    });

    test(' провал, пришло не массив', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate('admin');
      expect(res.isFailure()).toBe(true);
      expect(res.value).toEqual({
        ___array_whole_value_validation_error___: [
          {
            text: 'Значение должно быть массивом данных',
            name: 'IsArrayTypeRule',
            hint: {},
          },
        ],
      });
    });

    test(' провал, один из элементов в массиве не валидно', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate(['admin', 'officeChieff ']);
      expect(res.isFailure()).toBe(true);
      expect(res.value).toEqual({
        1: {
          roles: [
            {
              text: 'Значение должно быть одним из значений списка',
              name: 'StringChoiceValidationRule',
              hint: {
                choices: ['admin', 'staffManager', 'officeChieff', 'saleManager'],
              },
            },
          ],
        },
      });
    });

    test('провал, несоотвествие типа одного из элементов', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate(['admin', 1]);
      expect(res.isFailure()).toBe(true);
      expect(res.value).toEqual({
        1: {
          roles: [
            {
              text: 'Значение должно быть строковым значением',
              name: 'IsStringTypeRule',
              hint: {},
            },
          ],
        },
      });
    });

    describe('конфигурация литерального валидатора принимающего массив данных', () => {
      describe('массив должен быть заполнен', () => {
        test('успех, пришло заполненный массив', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, mustBeFilled: true }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(['admin']);
          expect(res.isSuccess()).toBe(true);
          expect(res.value).toBeUndefined();
        });

        test(' провал, пришло пустой массив', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, mustBeFilled: true }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate([]);
          expect(res.isFailure()).toBe(true);
          expect(res.value).toEqual({
            ___array_whole_value_validation_error___: [
              {
                text: 'Значение должно быть не пустым массивом данных',
                name: 'CannotBeEmptyArrayAssertionRule',
                hint: {},
              },
            ],
          });
        });

        test('провал, пришел undefined', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, mustBeFilled: true }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(undefined);
          expect(res.isFailure()).toBe(true);
          expect(res.value).toEqual({
            ___array_whole_value_validation_error___: [
              {
                text: 'Значение не должно быть undefined или null',
                name: 'CannotBeNullableAssertionRule',
                hint: {},
              },
            ],
          });
        });
      });

      describe('максимальное количество элементов массива', () => {
        test(' успех, пришел пустой массив', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, maxElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate([]);
          expect(res.isSuccess()).toBe(true);
          expect(res.value).toBeUndefined();
        });

        test('успех, количество элементов меньше максимального', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, maxElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(['admin']);
          expect(res.isSuccess()).toBe(true);
          expect(res.value).toBeUndefined();
        });

        test('успех, количество элементов равно максимальному', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, maxElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(['admin', 'staffManager']);
          expect(res.isSuccess()).toBe(true);
          expect(res.value).toBeUndefined();
        });

        test('провал, количество элементов больше максимального', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, maxElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(['admin', 'staffManager', 'officeChieff']);
          expect(res.isFailure()).toBe(true);
          expect(res.value).toEqual({
            ___array_whole_value_validation_error___: [
              {
                text: 'Максимальное количество элементов может быть {{max}}, сейчас {{currentCount}}',
                name: 'MaxArrayElementsCountAssertionRule',
                hint: {
                  max: 2,
                  currentCount: 3,
                },
              },
            ],
          });
        });

        test(' провал, пришел undefined', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, maxElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(undefined);
          expect(res.isFailure()).toBe(true);
          expect(res.value).toEqual({
            ___array_whole_value_validation_error___: [
              {
                hint: {},
                name: 'CannotBeNullableAssertionRule',
                text: 'Значение не должно быть undefined или null',
              },
            ],
          });
        });
      });

      describe('минимальное количество элементов массива', () => {
        test(' успех, количество элементов больше минимального', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, minElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(['admin', 'staffManager', 'officeChieff']);
          expect(res.isSuccess()).toBe(true);
          expect(res.value).toBeUndefined();
        });

        test('успех, количество элементов равно минимальному', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, minElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(['admin', 'staffManager']);
          expect(res.isSuccess()).toBe(true);
          expect(res.value).toBeUndefined();
        });

        test('провал, пришел пустой массив', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, minElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate([]);
          expect(res.isFailure()).toBe(true);
          expect(res.value).toEqual({
            ___array_whole_value_validation_error___: [
              {
                text: 'Минимальное количество элементов может быть {{min}}, сейчас {{currentCount}}',
                name: 'MinArrayElementsCountAssertionRule',
                hint: {
                  min: 2,
                  currentCount: 0,
                },
              },
            ],
          });
        });

        test('провал, количество элементов меньше минимального', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, minElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(['admin']);
          expect(res.isFailure()).toBe(true);
          expect(res.value).toEqual({
            ___array_whole_value_validation_error___: [
              {
                text: 'Минимальное количество элементов может быть {{min}}, сейчас {{currentCount}}',
                name: 'MinArrayElementsCountAssertionRule',
                hint: {
                  min: 2,
                  currentCount: 1,
                },
              },
            ],
          });
        });

        test(' провал, пришел undefined', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, minElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(undefined);
          expect(res.isFailure()).toBe(true);
          expect(res.value).toEqual({
            ___array_whole_value_validation_error___: [
              {
                hint: {},
                name: 'CannotBeNullableAssertionRule',
                text: 'Значение не должно быть undefined или null',
              },
            ],
          });
        });
      });
    });

    describe('массив должен быть обязательным, разрешено для null', () => {
      class CanNotBeUndefined extends LiteralFieldValidator<'roles', true, true, string> {
        protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
          return [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()];
        }
      }
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new CanNotBeUndefined('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      test('успех, пришло валидное значение', () => {
        const res = sut.validate(['admin']);
        expect(res.isSuccess()).toBe(true);
        expect(res.value).toBeUndefined();
      });

      test(' успех, пришло null', () => {
        const res = sut.validate(null);
        expect(res.isSuccess()).toBe(true);
        expect(res.value).toBeUndefined();
      });

      test('провал, пришло undefined', () => {
        const res = sut.validate(undefined);
        expect(res.isFailure()).toBe(true);
        expect(res.value).toEqual({
          ___array_whole_value_validation_error___: [
            {
              text: 'Значение не должно быть undefined',
              name: 'CannotBeUndefinedValidationRule',
              hint: {},
            },
          ],
        });
      });
    });
  });

  describe('Валидированное значение не обязательно', () => {
    test('успех, пришло валидное значение', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', false, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate(['admin']);
      expect(res.isSuccess()).toBe(true);
      expect(res.value).toBeUndefined();
    });

    test('успех, пришло undefined, null1', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', false, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const valueTest = [null, undefined];
      valueTest.forEach((value) => {
        const res = sut.validate(value);
        expect(res.isSuccess()).toBe(true);
        expect(res.value).toBeUndefined();
      });
    });

    test(' провал, пришло не массив', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', false, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate('admin');
      expect(res.isFailure()).toBe(true);
      expect(res.value).toEqual({
        ___array_whole_value_validation_error___: [
          {
            text: 'Значение должно быть массивом данных',
            name: 'IsArrayTypeRule',
            hint: {},
          },
        ],
      });
    });

    test('провал, один из элементов в массиве не валидно', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', false, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate(['admin', 'invaildAdmin']);
      expect(res.isFailure()).toBe(true);
      expect(res.value).toEqual({
        1: {
          roles: [
            {
              text: 'Значение должно быть одним из значений списка',
              name: 'StringChoiceValidationRule',
              hint: {
                choices: ['admin', 'staffManager', 'officeChieff', 'saleManager'],
              },
            },
          ],
        },
      });
    });

    describe('массив может быть необязательным, но он не может быть null', () => {
      class CanNotBeNull extends LiteralFieldValidator<'roles', false, true, string> {
        protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
          return [new CannotBeNullValidationRule(), new CanBeUndefinedValidationRule()];
        }
      }
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new CanNotBeNull('roles', false, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);

      test('успех, пришло валидное значение', () => {
        const res = sut.validate(['admin']);
        expect(res.isSuccess()).toBe(true);
        expect(res.value).toBeUndefined();
      });

      test(' успех, пришло undefined', () => {
        const res = sut.validate(undefined);
        expect(res.isSuccess()).toBe(true);
        expect(res.value).toBeUndefined();
      });

      test('провал, пришло null', () => {
        const res = sut.validate(null);
        expect(res.isFailure()).toBe(true);
        expect(res.value).toEqual({
          ___array_whole_value_validation_error___: [
            {
              text: 'Значение не может быть равным null',
              name: 'CannotBeNullValidationRule',
              hint: {},
            },
          ],
        });
      });
    });
  });
});
