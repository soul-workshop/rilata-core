import { describe, expect, test } from 'bun:test';
import { DtoFieldErrors } from '../../../../src/domain/validator/field-validator/types';
import { RuleError } from '../../../../src/domain/validator/rules/types';
import { ValidationRule } from '../../../../src/domain/validator/rules/validation-rule';
import { FieldValidatorPrivateFixtures as FieldValidatorFixtures, FieldValidatorPrivateFixtures } from './test-fixtures';
import { DtoFieldValidator } from '../../../../src/domain/validator/field-validator/dto-field-validator';

describe('Tests with the settings of the array itself.', () => {
//   const sut = FieldValidatorFixtures.contactAttrsValidatormap.phones;

  describe('not a required array.', () => {
    const sut = new DtoFieldValidator('phones', 'dto', false, { isArray: true }, FieldValidatorFixtures.phoneAttrsValidatorMap);
    test('success, passed an empty array', () => {
      const result = sut.validate([]);
      expect(result.isSuccess()).toBe(true);
      expect(result.value).toEqual(undefined);
    });

    test('success, passed a valid array', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
      ]);
      expect(result.isSuccess()).toBe(true);
      expect(result.value).toEqual(undefined);
    });

    test('failure, the value must be an object', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 'work', noOutField: 'empty info' },
        '1',
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: {
          1: {
            phones: [
              {
                text: 'Значение должно быть объектом',
                hint: {},
              },
            ],
          },
        },
      });
    });

    test('failure, the value must be an object', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 'work', noOutField: 'empty info' },
        { number: '+7-555-879-11-0215', type: 2, noOutField: 'info' },
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: {
          1: {
            number: [
              {
                text: 'Строка должна соответствовать формату: "+7-###-##-##"',
                hint: {},
              },
              {
                hint: {
                  count: 16,
                  current: 18,
                },
                text: 'Строка должна быть равна {{count}}, сейчас {{current}}',
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

    test('failure, the value must be an array of data', () => {
      const result = sut.validate(undefined);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: [
          {
            text: 'Значение должно быть массивом данных',
            hint: {},
          },
        ],
      });
    });
  });

  describe('required array', () => {
    const sut = new DtoFieldValidator('phones', 'dto', true, { isArray: true }, FieldValidatorFixtures.phoneAttrsValidatorMap);
    test('success, passed an empty array', () => {
      const result = sut.validate([]);
      expect(result.isSuccess()).toBe(true);
      expect(result.value).toEqual(undefined);
    });

    test('success, passed a valid array', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
      ]);
      expect(result.isSuccess()).toBe(true);
      expect(result.value).toEqual(undefined);
    });

    test('failure, passed an invalid array', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 'work', noOutField: 'empty info' },
        '1',
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: {
          1: {
            phones: [
              {
                hint: {},
                text: 'Значение должно быть объектом',
              },
            ],
          },
        },
      });
    });
    test('failure, the value must be an array of data', () => {
      const result = sut.validate(undefined);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: [
          {
            text: 'Значение должно быть массивом данных',
            hint: {},
          },
        ],
      });
    });
  });

  describe('array must be filled', () => {
    const sut = new DtoFieldValidator('phones', 'dto', true, { isArray: true, mustBeFilled: true }, FieldValidatorFixtures.phoneAttrsValidatorMap);
    test('failure, the value must be a non-empty data array', () => {
      const result = sut.validate([]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: [
          {
            text: 'Значение должно быть не пустым массивом данных',
            hint: {},
          },
        ],
      });
    });

    test('success, passed a non-empty array with valid values', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 'mobile', noOutField: 'empty info' },
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
      ]);
      expect(result.isSuccess()).toBe(true);
      expect(result.value).toEqual(undefined);
    });

    test('failure, the value must be an object', () => {
      const result = sut.validate([
        { number: '+7-777-287-81-82', type: 'work', noOutField: 'empty info' },
        '1',
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: {
          1: {
            phones: [
              {
                text: 'Значение должно быть объектом',
                hint: {},
              },
            ],
          },
        },
      });
    });
    test('failure, passed undefined', () => {
      const result = sut.validate(undefined);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: [
          {
            text: 'Значение должно быть массивом данных',
            hint: {},
          },
        ],
      });
    });
  });

  describe('the array must have a minimum number of values', () => {
    const sut = new DtoFieldValidator('phones', 'dto', true, {
      isArray: true, minElementsCount: 2,
    }, FieldValidatorFixtures.phoneAttrsValidatorMap);
    test('failure, passed with valid values with a smaller number of elements', () => {
      const result = sut.validate([
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: [
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

    test('succes, passed with valid values with a smaller number of elements', () => {
      const result = sut.validate([
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'empty info' },
        { number: '+7-747-159-10-42', type: 'mobile', noOutField: 'info' },
      ]);
      expect(result.isSuccess()).toBe(true);
      expect(result.value).toEqual(undefined);
    });

    test('succes, passed with valid values with a smaller number of elements', () => {
      const result = sut.validate([
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'empty info' },
        { number: '+7-747-159-10-42', type: 'mobile', noOutField: 'info' },
        { number: '+7-707-189-99-10', type: 'work', noOutField: 'empty info' },
      ]);
      expect(result.isSuccess()).toBe(true);
      expect(result.value).toEqual(undefined);
    });

    test('failure, the value must be an array of data', () => {
      const result = sut.validate(undefined);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: [
          {
            text: 'Значение должно быть массивом данных',
            hint: {},
          },
        ],
      });
    });
  });

  describe('the array must have the maximum number of valuess', () => {
    const sut = new DtoFieldValidator('phones', 'dto', true, {
      isArray: true, mustBeFilled: true, maxElementsCount: 2,
    }, FieldValidatorFixtures.phoneAttrsValidatorMap);
    test('succes, passed with valid values with the maximum number of elements', () => {
      const result = sut.validate([
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'info' },
      ]);
      expect(result.isSuccess()).toBe(true);
      expect(result.value).toEqual(undefined);
    });

    test('succes, passed with valid values with a limited number of elements', () => {
      const result = sut.validate([
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'empty info' },
        { number: '+7-747-159-10-42', type: 'mobile', noOutField: 'info' },
      ]);
      expect(result.isSuccess()).toBe(true);
      expect(result.value).toEqual(undefined);
    });

    test('failure, passed with valid values with a smaller number of elements', () => {
      const result = sut.validate([
        { number: '+7-555-879-11-02', type: 'work', noOutField: 'empty info' },
        { number: '+7-747-159-10-42', type: 'mobile', noOutField: 'info' },
        { number: '+7-707-189-99-10', type: 'work', noOutField: 'empty info' },
      ]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: [
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

    test('failure, the value must be an array of data', () => {
      const result = sut.validate(undefined);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: [
          {
            text: 'Значение должно быть массивом данных',
            hint: {},
          },
        ],
      });
    });
  });

  describe('array where one of the values is not valid', () => {
    const sut = FieldValidatorFixtures.contactAttrsValidatormap.phones;
    test('The number must be a string value', () => {
      const result = sut.validate([{ number: '1', type: 'mobile', noOutField: 'empty info' }]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        phones: {
          0: {
            number: [
              {
                text: 'Строка должна соответствовать формату: "+7-###-##-##"',
                hint: {},
              }, {
                text: 'Строка должна быть равна {{count}}, сейчас {{current}}',
                hint: {
                  count: 16,
                  current: 1,
                },
              },
            ],
          },
        },
      });
    });

    test('The number must be a string value ', () => {
      const valuesToTest = [true, 1, { a: 2 }, [1]];
      valuesToTest.forEach((value) => {
        const result = sut.validate([{ number: value, type: 'mobile', noOutField: 'empty info' }]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          phones: {
            0: {
              number: [
                {
                  text: 'Значение должно быть строковым значением',
                  hint: {},
                },
              ],
            },
          },
        });
      });
    });

    test('The number must not be undefined or null', () => {
      const valuesToTest = [null, undefined];
      valuesToTest.forEach((value) => {
        const result = sut.validate([{ number: value, type: 'mobile', noOutField: 'empty info' }]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          phones: {
            0: {
              number: [
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

    test('The type must be a string value ', () => {
      const valuesToTest = [true, 1, { a: 2 }, [1]];
      valuesToTest.forEach((value) => {
        const result = sut.validate([{ number: '+7-555-879-11-02', type: value, noOutField: 'empty info' }]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          phones: {
            0: {
              type: [
                {
                  text: 'Значение должно быть строковым значением',
                  hint: {},
                },
              ],
            },
          },
        });
      });
    });

    test('The type must not be undefined or null', () => {
      const valuesToTest = [null, undefined];
      valuesToTest.forEach((value) => {
        const result = sut.validate([{ number: '+7-555-879-11-02', type: value, noOutField: 'empty info' }]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          phones: {
            0: {
              type: [
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

    test('The type  must be one of the values in the list', () => {
      const result = sut.validate([{ number: '+7-555-879-11-02', type: 'phone', noOutField: 'empty info' }]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual(
        {
          phones: {
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
        },
      );
    });

    test('The noOutField must be a string value ', () => {
      const valuesToTest = [true, 1, { a: 2 }, [1]];
      valuesToTest.forEach((value) => {
        const result = sut.validate([{ number: '+7-555-879-11-02', type: 'mobile', noOutField: value }]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          phones: {
            0: {
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
    });

    test('The noOutField must not be undefined or null', () => {
      const valuesToTest = [null, undefined];
      valuesToTest.forEach((value) => {
        const result = sut.validate([{ number: '+7-555-879-11-02', type: 'mobile', noOutField: value }]);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          phones: {
            0: {
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
});
