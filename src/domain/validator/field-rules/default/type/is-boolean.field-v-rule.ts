import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../../types';
import { DefaultFieldValidationRule } from '../default.field-v-rule';

export const isBooleanRuleExplanation = 'ValueMustBeBoolean';

export class IsBooleanFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isBooleanRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    return typeof value === 'boolean'
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
