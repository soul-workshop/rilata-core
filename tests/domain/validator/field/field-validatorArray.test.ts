import { describe, expect, test } from 'bun:test';
import { DtoFieldErrors } from '../../../../src/domain/validator/field-validator/types';
import { RuleError } from '../../../../src/domain/validator/rules/types';
import { ValidationRule } from '../../../../src/domain/validator/rules/validation-rule';
import { FieldValidatorPrivateFixtures as FieldValidatorFixtures } from './test-fixtures';
import { DtoFieldValidator } from '../../../../src/domain/validator/field-validator/dto-field-validator';
import { LiteralFieldValidator } from '../../../../src/domain/validator/field-validator/literal-field-validator';
import { StringChoiceValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/string-choice.v-rule';
import { TrimEndStringLeadRule } from '../../../../src/domain/validator/rules/lead-rules/string/trim-end.l-rule';
import { CannotBeUndefinedValidationRule } from '../../../../src/domain/validator/rules/assert-rules/cannot-be-undefined.a-rule';
import { CanBeNullValidationRule } from '../../../../src/domain/validator/rules/nullable-rules/can-be-only-null.n-rule';
import { CannotBeNullValidationRule } from '../../../../src/domain/validator/rules/assert-rules/cannot-be-null.a-rule';
import { CanBeUndefinedValidationRule } from '../../../../src/domain/validator/rules/nullable-rules/can-be-only-undefined.n-rule';
import { DTO } from '../../../../src/domain/dto';

describe('тесты литерального валидатора принимающего массив данных', () => {
  describe('Валидированное значение обязательно', () => {
    test(' успех, пришло валидное значение', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate(['admin']);
      expect(res.isSuccess()).toBe(true);
      expect(res.value).toBe(undefined);
    });

    test('успех, приведение значений работает для элементов массива', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)], [new TrimEndStringLeadRule()]);
      const res = sut.validate(['admin  ']);
      expect(res.isSuccess()).toBe(true);
      expect(res.value).toBe(undefined);
    });

    test(' провал, пришло undefined, null', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const valuesToTest = [undefined, null];
      valuesToTest.forEach((value) => {
        const res = sut.validate(value);
        expect(res.isFailure()).toBe(true);
        expect(res.value).toEqual({
          roles: [
            {
              text: 'Значение не должно быть undefined или null',
              hint: {},
            },
          ],
        });
      });
    });

    test(' провал, пришло не массив', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate(['admin ']);
      expect(res.isFailure()).toBe(true);
      expect(res.value).toEqual({
        roles: {
          0: [
            {
              text: 'Значение должно быть одним из значений списка',
              hint: {
                choices: ['admin', 'staffManager', 'officeChieff', 'saleManager'],
              },
            },
          ],
        },
      });
    });

    test(' провал, один из элементов в массиве не валидно', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate(['admin', 'officeChieff ']);
      expect(res.isFailure()).toBe(true);
      expect(res.value).toEqual(undefined);
    });

    test('провал, несоотвествие типа одного из элементов', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate(['admin', 1]);
      expect(res.isFailure()).toBe(true);
      expect(res.value).toEqual({
        roles: {
          1: {
            roles: [
              {
                text: 'Значение должно быть строковым значением',
                hint: {},
              },
            ],
          },
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
          expect(res.value).toBe(undefined);
        });

        test(' провал, пришло пустой массив', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, mustBeFilled: true }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate([]);
          expect(res.isFailure()).toBe(true);
          expect(res.value).toEqual({
            roles: [
              {
                text: 'Значение должно быть не пустым массивом данных',
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
            roles: [
              {
                text: 'Значение не должно быть undefined или null',
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
          expect(res.value).toBe(undefined);
        });

        test('успех, количество элементов меньше максимального', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, maxElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(['admin']);
          expect(res.isSuccess()).toBe(true);
          expect(res.value).toBe(undefined);
        });

        test('успех, количество элементов равно максимальному', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, maxElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(['admin', 'staffManager']);
          expect(res.isSuccess()).toBe(true);
          expect(res.value).toBe(undefined);
        });

        test('провал, количество элементов больше максимального', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, maxElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(['admin', 'staffManager', 'officeChieff']);
          expect(res.isFailure()).toBe(true);
          expect(res.value).toEqual({
            roles: [
              {
                text: 'Максимальное количество элементов может быть {{max}}, сейчас {{currentCount}}',
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
            roles: [
              {
                hint: {},
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
          expect(res.value).toBe(undefined);
        });

        test('успех, количество элементов равно минимальному', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, minElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate(['admin', 'staffManager']);
          expect(res.isSuccess()).toBe(true);
          expect(res.value).toBe(undefined);
        });

        test('провал, пришел пустой массив', () => {
          const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
          const sut = new LiteralFieldValidator('roles', true, { isArray: true, minElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)]);
          const res = sut.validate([]);
          expect(res.isFailure()).toBe(true);
          expect(res.value).toEqual({
            roles: [
              {
                text: 'Минимальное количество элементов может быть {{min}}, сейчас {{currentCount}}',
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
            roles: [
              {
                text: 'Минимальное количество элементов может быть {{min}}, сейчас {{currentCount}}',
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
            roles: [
              {
                hint: {},
                text: 'Значение не должно быть undefined или null',
              },
            ],
          });
        });
      });
    });

    describe('массив должен быть обязательным, разрешено для null', () => {
      class Cannotbe extends LiteralFieldValidator<'roles', true, true, string> {
        protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
          return [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()];
        }
      }
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new Cannotbe('roles', true, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      test('успех, пришло валидное значение', () => {
        const res = sut.validate(['admin']);
        expect(res.isSuccess()).toBe(true);
        expect(res.value).toBe(undefined);
      });

      test(' успех, пришло null', () => {
        const res = sut.validate(null);
        expect(res.isSuccess()).toBe(true);
        expect(res.value).toBe(undefined);
      });

      test('провал, пришло undefined', () => {
        const res = sut.validate(undefined);
        expect(res.isFailure()).toBe(true);
        expect(res.value).toEqual({
          roles: [
            {
              text: 'Значение не должно быть undefined',
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
      expect(res.value).toBe(undefined);
    });

    test('успех, пришло undefined, null', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', false, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const valueTest = [null, undefined];
      valueTest.forEach((value) => {
        const res = sut.validate(value);
        expect(res.isSuccess()).toBe(true);
        expect(res.value).toBe(undefined);
      });
    });

    test(' провал, пришло не массив', () => {
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new LiteralFieldValidator('roles', false, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);
      const res = sut.validate(1);
      expect(res.isFailure()).toBe(true);
      expect(res.value).toEqual({
        roles: [
          {
            text: 'Значение должно быть массивом данных',
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
        roles: {
          1: [
            {
              hint: {
                choices: [
                  'admin',
                  'staffManager',
                  'officeChieff',
                  'saleManager',
                ],
              },
              text: 'Значение должно быть одним из значений списка',
            },
          ],
        },
      });
    });

    describe('массив должен быть обязательным, кроме undefined', () => {
      class Cannotbe extends LiteralFieldValidator<'roles', false, true, string> {
        protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
          return [new CannotBeNullValidationRule(), new CanBeUndefinedValidationRule()];
        }
      }
      const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
      const sut = new Cannotbe('roles', false, { isArray: true }, 'string', [new StringChoiceValidationRule(roles)]);

      test('успех, пришло валидное значение', () => {
        const res = sut.validate(['admin']);
        expect(res.isSuccess()).toBe(true);
        expect(res.value).toBe(undefined);
      });

      test(' успех, пришло undefined', () => {
        const res = sut.validate(undefined);
        expect(res.isSuccess()).toBe(true);
        expect(res.value).toBe(undefined);
      });

      test('провал, пришло null', () => {
        const res = sut.validate(null);
        expect(res.isFailure()).toBe(true);
        expect(res.value).toEqual({
          roles: [
            {
              text: 'Значение не может быть равным null',
              hint: {},
            },
          ],
        });
      });
    });
  });
});

describe('тесты объектного валидатора, принимающего массив данных', () => {
  describe('Валидированное значение обязательно', () => {
    const sut = new DtoFieldValidator('phones', true, { isArray: true }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap);

    test('успех, пришло валидное значение', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
      ]);
      expect(result.isSuccess()).toBe(true);
      expect(result.value).toBe(undefined);
    });

    test(' провал, пришло undefined, null', () => {
      const valuesToTest = [null, undefined];
      valuesToTest.forEach((value) => {
        const res = sut.validate(value);
        expect(res.isFailure()).toBe(true);
        expect(res.value).toEqual({
          ___whole_value_validation_error___: [
            {
              text: 'Значение не должно быть undefined или null',
              hint: {},
            },
          ],
        });
      });
    });

    test('провал, пришло не массив', () => {
      const result = sut.validate(1);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        ___whole_value_validation_error___: [
          {
            text: 'Значение должно быть массивом данных',
            hint: {},
          },
        ],
      });
    });

    test('провал, один из элементов в массиве имеет неправильный атрибут', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 1, noOutField: 'empty info' },
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        ___whole_value_validation_error___: {
          0: {
            type: [
              {
                hint: {},
                text: 'Значение должно быть строковым значением',
              },
            ],
          },
        },
      });
    });

    test(' провал, несколько элементов в массиве имеет один или несколько неправильных атрибутов', () => {
      const result = sut.validate([
        { number: '85-777-287-81-82', type: 1, noOutField: 'empty info' },
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        ___whole_value_validation_error___: {
          0: {
            number: [
              {
                hint: {},
                text: 'Строка должна соответствовать формату: "+7-###-##-##"',
              },
            ],
            type: [
              {
                hint: {},
                text: 'Значение должно быть строковым значением',
              },
            ],
          },
        },
      });
    });

    test('провал, один из элементов не dto', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
        1,
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        ___whole_value_validation_error___: {
          1: {
            ___whole_value_validation_error___: [
              {
                text: 'Значение должно быть объектом',
                hint: {},
              },
            ],
          },
        },
      });
    });

    describe('cannot-be-undefined: ', () => {
      class Cannotbe extends DtoFieldValidator< 'phones', true, true, DTO> {
        protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
          return [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()];
        }
      }
      const sutCanBe = new Cannotbe('phones', true, { isArray: true }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap);

      test('успех, пришло валидное значение', () => {
        const result = sutCanBe.validate([
          { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
        ]);
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(undefined);
      });

      test('успех, пришло null', () => {
        const result = sutCanBe.validate(null);
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(undefined);
      });

      test('провал, пришло undefined', () => {
        const result = sutCanBe.validate(undefined);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___whole_value_validation_error___: [
            {
              text: 'Значение не должно быть undefined',
              hint: {},
            },
          ],
        });
      });

      test('провал, пришло не массив', () => {
        const result = sutCanBe.validate(1);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___whole_value_validation_error___: [
            {
              text: 'Значение должно быть массивом данных',
              hint: {},
            },
          ],
        });
      });

      test('провал, один из элементов в массиве имеет неправильный атрибут', () => {
        const result = sutCanBe.validate([
          { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
          { number: '+7-555-879-11-02', type: 'home', noOutField: 'invalid info' },
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___whole_value_validation_error___: {
            1: {
              type: [
                {
                  text: 'Значение должно быть одним из значений списка',
                  hint: {
                    choices: ['mobile', 'work'],
                  },
                },
              ],
            },
          },
        });
      });

      test('провал, один из элементов не dto', () => {
        const result = sutCanBe.validate([
          { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
          1,
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___whole_value_validation_error___: {
            1: {
              ___whole_value_validation_error___: [
                {
                  text: 'Значение должно быть объектом',
                  hint: {},
                },
              ],
            },
          },
        });
      });
    });
  });

  describe('isNotRequired_tests', () => {
    const sut = new DtoFieldValidator('phones', false, { isArray: true }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap);
    test('успех, пришло валидное значение', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
      ]);
      expect(result.isSuccess()).toBe(true);
      expect(result.value).toBe(undefined);
    });

    test('успех, пришло undefined, null,', () => {
      const valuesToTest = [null, undefined];
      valuesToTest.forEach((value) => {
        const res = sut.validate(value);
        expect(res.isSuccess()).toBe(true);
        expect(res.value).toEqual(undefined);
      });
    });

    test('провал, пришел не массив', () => {
      const result = sut.validate(12);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        ___whole_value_validation_error___: [
          {
            text: 'Значение должно быть массивом данных',
            hint: {},
          },
        ],
      });
    });

    test('провал, один из элементов имеет неправильный атрибут', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 'home', noOutField: 'empty info' },
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'empty info' },
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        ___whole_value_validation_error___: {
          0: {
            type: [
              {
                text: 'Значение должно быть одним из значений списка',
                hint: {
                  choices: ['mobile', 'work'],
                },
              },
            ],
          },
        },
      });
    });

    test('провал, один из элементов в массиве имеет несколько неправильных атрибутов', () => {
      const result = sut.validate([
        { number: '9-777-287-81-82', type: 'invalidType', noOutField: 'empty info' },
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'empty info' },
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        ___whole_value_validation_error___: {
          0: {
            number: [
              {
                text: 'Строка должна соответствовать формату: "+7-###-##-##"',
                hint: {},
              }, {
                text: 'Длина строки должна быть равна {{count}}, сейчас {{current}}',
                hint: {
                  count: 16,
                  current: 15,
                },
              },
            ],
            type: [
              {
                text: 'Значение должно быть одним из значений списка',
                hint: {
                  choices: ['mobile', 'work'],
                },
              },
            ],
          },
        },
      });
    });

    test('провал, несколько элементов в массиве имеет один или несколько неправильных атрибутов', () => {
      const result = sut.validate([
        { number: '+15-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
        { number: '+7-555-879-11-02', type: 'invalidType', noOutField: 'empty info' },
        { number: '+7-999-000-00-00', type: 'invalidType', invalidAttribute: 'empty value' },
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        ___whole_value_validation_error___: {
          0: {
            number: [
              {
                text: 'Строка должна соответствовать формату: "+7-###-##-##"',
                hint: {},
              }, {
                text: 'Длина строки должна быть равна {{count}}, сейчас {{current}}',
                hint: {
                  count: 16,
                  current: 17,
                },
              },
            ],
          },
          1: {
            type: [
              {
                text: 'Значение должно быть одним из значений списка',
                hint: {
                  choices: ['mobile', 'work'],
                },
              },
            ],
          },
          2: {
            type: [
              {
                text: 'Значение должно быть одним из значений списка',
                hint: {
                  choices: ['mobile', 'work'],
                },
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

    describe('can-be-undefined', () => {
      class Cannotbe extends DtoFieldValidator< 'phones', false, true, DTO> {
        protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
          return [new CannotBeNullValidationRule(), new CanBeUndefinedValidationRule()];
        }
      }
      const sutCanBe = new Cannotbe('phones', false, { isArray: true }, 'dto', FieldValidatorFixtures.phoneAttrsValidatorMap);

      test('успех, пришло валидное значение', () => {
        const result = sutCanBe.validate([
          { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
          { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
        ]);
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(undefined);
      });

      test(' успех, пришло undefined', () => {
        const result = sutCanBe.validate(undefined);
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(undefined);
      });

      test('провал, пришло null', () => {
        const result = sutCanBe.validate(null);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___whole_value_validation_error___: [
            {
              text: 'Значение не может быть равным null',
              hint: {},
            },
          ],
        });
      });

      test('провал, пришло не массив', () => {
        const result = sutCanBe.validate(1);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___whole_value_validation_error___: [
            {
              text: 'Значение должно быть массивом данных',
              hint: {},
            },
          ],
        });
      });

      test('провал, один из элементов в массиве имеет неправильный атрибут', () => {
        const result = sut.validate([
          { number: '+7-777-287-81-82', type: 1, noOutField: 'empty info' },
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___whole_value_validation_error___: {
            0: {
              type: [
                {
                  hint: {},
                  text: 'Значение должно быть строковым значением',
                },
              ],
            },
          },
        });
      });

      test('провал, один из элементов не dto', () => {
        const result = sut.validate([
          { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
          1,
        ]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          ___whole_value_validation_error___: {
            1: {
              ___whole_value_validation_error___: [
                {
                  text: 'Значение должно быть объектом',
                  hint: {},
                },
              ],
            },
          },
        });
      });
    });
  });
});
