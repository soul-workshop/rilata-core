import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../../types';
import { DefaultFieldValidationRule } from '../default.field-v-rule';

export const isNumberArrayRuleExplanation = 'ValueMustBeArrayOfNumbers';

export class IsNumberArrayFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isNumberArrayRuleExplanation;

  validate(value: Array<unknown>): FieldValidationRuleResult {
    return (value.every((elem) => typeof elem === 'number'))
      ? {
        behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
      }
      : {
        behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndBreakFieldValidation,
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [],
        },
      };
  }
}
