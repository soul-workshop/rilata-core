import { describe, expect, test } from 'bun:test';
import { IsDTOTypeRule } from './is-dto-type.t-rule.ts';

describe('IsDTOTypeRule', () => {
  test('success, received value equal DTO', () => {
    const rule = new IsDTOTypeRule();
    const result = rule.validate(
      {
        name: 'Ivan',
        surname: 'Alexey',
      },
    );
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });

  test('fail, received value equal not empty boolean', () => {
    const rule = new IsDTOTypeRule();
    const valuesToCheck = ['not a number', ' ', '4', ['2', '3']];
    valuesToCheck.forEach((value) => {
      const validationResult = rule.validate(value);
      expect(validationResult).toEqual({
        behaviour: 'SaveErrorAndBreakValidation',
        ruleError: {
          hint: {},
          name: 'IsDTOTypeRule',
          text: 'Значение должно быть объектом',
        },
      });
    });
  });
});
