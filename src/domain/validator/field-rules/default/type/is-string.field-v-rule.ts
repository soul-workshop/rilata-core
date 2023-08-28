import { FieldValidationRuleResult } from '../../types';
import { DefaultFieldValidationRule } from '../default.field-v-rule';

export const isStringRuleExplanation = 'ValueMustBeString';

export class IsStringFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isStringRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    return typeof value === 'string'
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
