import { describe, expect, test } from 'bun:test';
import { CannotBeNullValidationRule } from '../../../../../../src/domain/validator/rules/assert-rules/cannot-be-null.a-rule';

describe('can not be null  rule tests', () => {
  test('fail, received value equal null', () => {
    const sut = new CannotBeNullValidationRule();
    const result = sut.validate(null);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndBreakValidation',
      ruleError: {
        hint: {},
        text: 'Значение не может иметь значение null',
      },
    });
  });

  test('success, received value equal undefined', () => {
    const sut = new CannotBeNullValidationRule();
    const result = sut.validate(undefined);
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, received value not equal null', () => {
    const diffTypes = ['s', 5, true, ['5'], { a: 5 }];
    diffTypes.forEach((type) => {
      const sut = new CannotBeNullValidationRule();
      const result = sut.validate(type);
      expect(result).toEqual({
        behaviour: 'RunNextRule',
      });
    });
  });
});
