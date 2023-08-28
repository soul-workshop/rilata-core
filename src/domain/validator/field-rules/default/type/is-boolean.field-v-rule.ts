import { FieldValidationRuleResult } from '../../types';
import { DefaultFieldValidationRule } from '../default.field-v-rule';

export const isBooleanRuleExplanation = 'ValueMustBeBoolean';

export class IsBooleanFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isBooleanRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    return typeof value === 'boolean'
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
