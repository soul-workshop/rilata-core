import {describe, expect,test} from "bun:test";
import { IsNumberTypeRule } from "../../../../../src/domain/validator/rules/type-rules/is-number-type.t-rule";

describe('IsNumberTypeRule', () => {
  test('success, received value equal number', () => {
    const rule = new IsNumberTypeRule();
    const result = rule.validate(42); // Здесь 42 - это число
    expect(result).toEqual({
        behaviour: "RunNextRule"
    });
  });

  test('fail, received value equal not empty number', () => {
    const rule = new IsNumberTypeRule();
    const result = rule.validate('not a number'); // Здесь 'not a number' - это не число
    const valuesToCheck = ['not a number', ' ', '4', ['2', '3']];
    
    valuesToCheck.forEach((value) => {
      const validationResult = rule.validate(value);
      expect(validationResult).toEqual({
        behaviour: "SaveErrorAndBreakValidation",
        ruleError: {
          "hint": {},
          "text": "Значение должно быть числовым"
        }
    });
  });
});
});
