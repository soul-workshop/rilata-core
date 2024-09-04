import { describe, expect, test } from 'bun:test';
import { CannotBeEmptyArrayAssertionRule } from './cannot-be-empty-array.a-rule.ts';

describe('can not empty array rule tests', () => {
  test('success, received value not empty array', () => {
    const sut = new CannotBeEmptyArrayAssertionRule();
    const result = sut.validate([1]);
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('fail, received value equal empty array', () => {
    const sut = new CannotBeEmptyArrayAssertionRule();
    const result = sut.validate([]);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndBreakValidation',
      ruleError: {
        hint: {},
        name: 'CannotBeEmptyArrayAssertionRule',
        text: 'Значение должно быть не пустым массивом данных',
      },
    });
  });
});
