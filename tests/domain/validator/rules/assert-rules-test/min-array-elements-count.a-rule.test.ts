import { describe, test, expect } from 'bun:test';
import { MinArrayElementsCountAssertionRule } from '../../../../../src/domain/validator/rules/assert-rules/min-array-elements-count.a-rule';

describe('min array elements count rule', () => {
  describe('min array elements can be 0', () => {
    const sut = new MinArrayElementsCountAssertionRule(0);
    test('success, valueArray length is equal min', () => {
      const res = sut.validate([]);
      expect(res).toEqual({ behaviour: 'RunNextRule' });
    });
    test('success, valueArray length is more than min', () => {
      const res = sut.validate([1, 2, 3, 4]);
      expect(res).toEqual({ behaviour: 'RunNextRule' });
    });
  });

  describe('min array elements  can not be 0', () => {
    const sut = new MinArrayElementsCountAssertionRule(3);
    test('success, valueArray length is more than min', () => {
      const res = sut.validate([1, 2, 3, 4]);
      expect(res).toEqual({ behaviour: 'RunNextRule' });
    });
    test('failure, valueArray length is empty', () => {
      const res = sut.validate([]);
      expect(res).toEqual({
        behaviour: 'SaveErrorAndBreakValidation',
        ruleError: {
          hint: {
            currentCount: 0,
            min: 3,
          },
          text: 'Минимальное количество элементов может быть {{min}}, сейчас {{currentCount}}',
        },
      });
    });
    test('success, valueArray length is  equal to min', () => {
      const res = sut.validate([1, 2, 3]);
      expect(res).toEqual({ behaviour: 'RunNextRule' });
    });
    test('failure, valueArray length is less than or than min', () => {
      const res = sut.validate([1, 2]);
      expect(res).toEqual({
        behaviour: 'SaveErrorAndBreakValidation',
        ruleError: {
          hint: {
            currentCount: 2,
            min: 3,
          },
          text: 'Минимальное количество элементов может быть {{min}}, сейчас {{currentCount}}',
        },
      });
    });
  });
});
