import {describe, expect,test} from "bun:test";
import { IsStringTypeRule } from "../../../../../src/domain/validator/rules/type-rules/is-string-type.t-rule";

describe('IsStringTypeRule', () => {
    test('success, received value equal string', () => {
      const rule = new IsStringTypeRule();
      const result = rule.validate('Hello World'); 
      expect(result).toEqual({
          behaviour: "RunNextRule"
      });
    });
  
    test('fail, received value equal not empty string', () => {
      const rule = new IsStringTypeRule();
      const result = rule.validate(5); 
      const valuesToCheck = [3, [2, 3]];
      
      valuesToCheck.forEach((value) => {
        const validationResult = rule.validate(value);
        expect(validationResult).toEqual({
          behaviour: "SaveErrorAndBreakValidation",
          ruleError: {
            "hint": {},
            "text": "Значение должно быть строковым значением"
          }
      });
    });
  });
  });