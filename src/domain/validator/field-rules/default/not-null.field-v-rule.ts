import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../types';
import { DefaultFieldValidationRule } from './default.field-v-rule';

export const notNullRuleExplanation = 'ValueMustNotBeNull';

export class NotNullFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = notNullRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    return value === null
      ? {
        behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndBreakFieldValidation,
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [],
        },
      }
      : {
        behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
      };
  }
}
