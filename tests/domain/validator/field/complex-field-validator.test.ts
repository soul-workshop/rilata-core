import { describe, test, expect } from 'bun:test';
import { LiteralFieldValidator } from '../../../../src/domain/validator/field-validator/literal-field-validator';
import { FullFieldResult } from '../../../../src/domain/validator/field-validator/types';
import { success } from '../../../../src/common/result/success';
import { failure } from '../../../../src/common/result/failure';

class EveryNextValueMustBeDoubleProgressFieldValidator extends LiteralFieldValidator<
  'array',
  true,
  true,
  number
  > {
  constructor() {
    super('array', true, { isArray: true, minElementsCount: 2 }, 'number', []);
  }

  protected complexValidate(value: number[]): FullFieldResult {
    // Проверка каждого элемента массива
    for (let i = 1; i < value.length; i += 1) {
      if (value[i] !== value[i - 1] * 2) {
        return failure({
          [i]: {
            array: [
              {
                text: 'Значение должно быть в два раза больше чем предыдущий',
                name: 'complexValidateRule',
                hint: {},
              },
            ],
          },
        });
      }
    }

    return success(undefined);
  }
}

describe(
  'Валидатор, который проверяет чтобы каждый следующий элемент был в два раза больше',
  () => {
    const sut = new EveryNextValueMustBeDoubleProgressFieldValidator();
    test('успех, валидация прошла успешно', () => {
      const result = sut.validate([2, 4, 8, 16, 32]);
      expect(result.isSuccess()).toBe(true);
    });
    
    test('провал, второе значение не валидно', () => {
      const result = sut.validate([2, 6, 8, 16, 32]);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        1: {
          array: [
            {
              text: 'Значение должно быть в два раза больше чем предыдущий',
              name: 'complexValidateRule',
              hint: {},
            },
          ],
        },
      });
    });
   
    test('провал, значение должно быть числовым', () => {
      const result = sut.validate([2, 4, undefined, 16,'stay']);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        "2": {
          array: [
            {
              text: "Значение должно быть числовым",
              hint: {},
              name: "IsNumberTypeRule",
            }
          ],
        },
        "4": {
          array: [
            {
              text: "Значение должно быть числовым",
              hint: {},
              name: "IsNumberTypeRule",
            }
          ],
        },
      });
    });
  },
);
