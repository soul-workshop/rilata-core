import { FieldValidationRuleResult } from '../types';
import { DefaultFieldValidationRule } from './default.field-v-rule';

export const isArrayRuleExplanation = 'ValueMustBeArray';

export class IsArrayFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isArrayRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    return Array.isArray(value)
      ? {
        behaviour: 'RunNextRule',
      }
      : {
        behaviour: 'SaveErrorAndBreakFieldValidation',
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [],
        },
      };
  }
}
