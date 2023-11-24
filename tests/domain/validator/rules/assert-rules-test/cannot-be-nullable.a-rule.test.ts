import { describe, expect, test } from 'bun:test';
import { CannotBeNullableAssertionRule } from '../../../../../src/domain/validator/rules/assert-rules/cannot-be-nullable.a-rule';

describe('can not be nullable  rule tests', () => {
  test('success, received value not equal undefined or null', () => {
    const sut = new CannotBeNullableAssertionRule();
    const diffTypes = ['s', 5, true, ['5'], { a: 5 }];
    diffTypes.forEach((type) => {
      const result = sut.validate(type);
      expect(result).toEqual({
        behaviour: 'SuccessRunNextRule',
      });
    });
  });

  test('fail, received value equal null or undefined', () => {
    const sut = new CannotBeNullableAssertionRule();
    const diffTypes = [undefined, null];
    diffTypes.forEach((type) => {
      const result = sut.validate(type);
      expect(result).toEqual({
        behaviour: 'SaveErrorAndBreakValidation',
        ruleError: {
          hint: {},
          name: 'CannotBeNullableAssertionRule',
          text: 'Значение не должно быть undefined или null',
        },
      });
    });
  });
});
