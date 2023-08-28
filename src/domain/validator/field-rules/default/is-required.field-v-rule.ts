import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../types';
import { DefaultFieldValidationRule } from './default.field-v-rule';

export const isRequiredRuleExplanation = 'ValueIsRequired';

export class IsRequiredFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isRequiredRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    const failureCases = value === undefined
      || value === ''
      || (Array.isArray(value) && value.length === 0);
    return failureCases
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
