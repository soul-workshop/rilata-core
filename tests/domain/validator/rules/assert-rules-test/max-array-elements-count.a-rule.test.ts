import { describe, expect, test } from 'bun:test';
import { MaxArrayElementsCountAssertionRule } from '../../../../../src/domain/validator/rules/assert-rules/max-array-elements-count.a-rule';

describe('max array elements count rule', () => {
  describe('max array elements  can be  0', () => {
    const sut = new MaxArrayElementsCountAssertionRule(0);
    test('failure, the length of the value array is greater than max.', () => {
      const res = sut.validate([1, 2]);
      expect(res).toEqual({
        behaviour: 'SaveErrorAndBreakValidation',
        ruleError: {
          hint: {
            currentCount: 2,
            max: 0,
          },
          text: 'Максимальное количество элементов может быть {{max}}, сейчас {{currentCount}}',
        },
      });
    });
    test('success, valueArray length is  empty', () => {
      const res = sut.validate([]);
      expect(res).toEqual({ behaviour: 'SuccessRunNextRule' });
    });
  });

  describe('max array elements  can not be  0', () => {
    const sut = new MaxArrayElementsCountAssertionRule(5);
    test('success, valueArray length is less than or equal to max', () => {
      const res = sut.validate([1, 2, 3, 4]);
      expect(res).toEqual({ behaviour: 'SuccessRunNextRule' });
    });
    test('success, valueArray length is  equal to max', () => {
      const res = sut.validate([1, 2, 3, 4, 5]);
      expect(res).toEqual({ behaviour: 'SuccessRunNextRule' });
    });
    test('success, valueArray length is  empty', () => {
      const res = sut.validate([]);
      expect(res).toEqual({ behaviour: 'SuccessRunNextRule' });
    });
    test('failure, the length of the value array is greater than max. ', () => {
      const res = sut.validate([1, 2, 3, 4, 5, 6, 0, 12]);
      expect(res).toEqual({
        behaviour: 'SaveErrorAndBreakValidation',
        ruleError: {
          hint: {
            currentCount: 8,
            max: 5,
          },
          text: 'Максимальное количество элементов может быть {{max}}, сейчас {{currentCount}}',
        },
      });
    });
  });
});
