import { describe, expect, test } from 'bun:test';
import { CannotBeEmptyStringValidationRule } from './cannot-be-empty-string.a-rule.ts';

describe('can not empty string rule tests', () => {
  test('success, received value equal string', () => {
    const sut = new CannotBeEmptyStringValidationRule();
    const arrayString = ['s', 'not empty', ' ', '0', ';'];
    arrayString.forEach((type) => {
      const result = sut.validate(type);
      expect(result).toEqual({
        behaviour: 'SuccessRunNextRule',
      });
    });
  });

  test('fail, received value equal empty  string', () => {
    const sut = new CannotBeEmptyStringValidationRule();
    const result = sut.validate('');
    expect(result).toEqual({
      behaviour: 'SaveErrorAndBreakValidation',
      ruleError: {
        hint: {},
        name: 'CannotBeEmptyStringValidationRule',
        text: 'Значение должно быть не пустой строкой',
      },
    });
  });
});
