import { describe, expect, test } from 'bun:test';
import { CannotBeUndefinedValidationRule } from '../../../../../src/domain/validator/rules/assert-rules/cannot-be-undefined.a-rule';

describe('can not be null  rule tests', () => {
  test('fail, received value equal undefined', () => {
    const sut = new CannotBeUndefinedValidationRule();
    const result = sut.validate(undefined);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndBreakValidation',
      ruleError: {
        hint: {},
        text: 'Значение не должно быть undefined',
      },
    });
  });

  test('success, received value equal null', () => {
    const sut = new CannotBeUndefinedValidationRule();
    const result = sut.validate(null);
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });

  test('success, received value not equal undefined', () => {
    const sut = new CannotBeUndefinedValidationRule();
    const diffTypes = ['s', 5, true, ['5'], { a: 5 }];
    diffTypes.forEach((type) => {
      const result = sut.validate(type);
      expect(result).toEqual({
        behaviour: 'RunNextRule',
      });
    });
  });
});
