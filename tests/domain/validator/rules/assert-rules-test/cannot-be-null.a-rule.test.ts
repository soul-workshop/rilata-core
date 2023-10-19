import { describe, expect, test } from 'bun:test';
import { CannotBeNullValidationRule } from '../../../../../src/domain/validator/rules/assert-rules/cannot-be-null.a-rule';

describe('can not be null  rule tests', () => {
  test('fail, received value equal null', () => {
    const sut = new CannotBeNullValidationRule();
    const result = sut.validate(null);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndBreakValidation',
      ruleError: {
        hint: {},
        text: 'Значение не может быть равным null',
      },
    });
  });

  test('success, undefined is a valid value', () => {
    const sut = new CannotBeNullValidationRule();
    const result = sut.validate(undefined);
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('success, received value not equal null', () => {
    const sut = new CannotBeNullValidationRule();
    const diffTypes = ['s', 5, true, ['5'], { a: 5 }];
    diffTypes.forEach((type) => {
      const result = sut.validate(type);
      expect(result).toEqual({
        behaviour: 'SuccessRunNextRule',
      });
    });
  });
});
