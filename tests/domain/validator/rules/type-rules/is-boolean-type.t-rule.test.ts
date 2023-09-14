import {describe, expect,test} from "bun:test";
import { IsBooleanTypeRule } from "../../../../../src/domain/validator/rules/type-rules/is-boolean-type.t-rule";


describe('IsBooleanTypeRule', () => {
  test('success, reseived value equal boolean', () => {
    const rule = new IsBooleanTypeRule();
    const valuesToCheck = [true, false]; //отдаем массив из булеан значений
    valuesToCheck.forEach((value)=>{
        const validationResult=rule.validate(value);
        expect(validationResult).toEqual({
            behaviour: "RunNextRule"
        });
    })
  });

  test('fail, received value equal not empty boolean', () => {
    const rule = new IsBooleanTypeRule();
    const valuesToCheck = ['not a number', ' ', '4', ['2', '3']];
    valuesToCheck.forEach((value) => {
      const validationResult = rule.validate(value);
      expect(validationResult).toEqual({
        behaviour: "SaveErrorAndBreakValidation",
        ruleError: {
          "hint": {},
          "text": "Значение должно быть булевым"
        }
    });
    })
  });
});
