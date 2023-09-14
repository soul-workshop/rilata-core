import {describe, expect,test} from "bun:test";
import { IsArrayTypeRule } from "../../../../../src/domain/validator/rules/type-rules/is-array-type.t-rule";

describe('IsArrayTypeRule', () => {
  test('success, reseived value equal array', () => {
    const rule = new IsArrayTypeRule();
    const result = rule.validate([1, 2, 3]); //отдаем массив
    expect(result).toEqual({
        behaviour: "RunNextRule"
    });
  });

  test('should return "SaveErrorAndBreakValidation" for an array with different types', () => {
    const rule = new IsArrayTypeRule();
    const valuesToCheck = ['not an array', 42, true];
    valuesToCheck.forEach((value)=>{
        const validationResult = rule.validate(value);
        expect(validationResult).toEqual({
            behaviour: "SaveErrorAndBreakValidation",
            ruleError: {
            "hint": {},
            "text": "Значение должно быть массивом данных"
            }
        })
    })
  });
});
