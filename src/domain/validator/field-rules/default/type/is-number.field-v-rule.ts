import { FieldValidationRuleResult } from '../../types';
import { DefaultFieldValidationRule } from '../default.field-v-rule';

export const isNumberRuleExplanation = 'ValueMustBeNumber';

export class IsNumberFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isNumberRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    return typeof value === 'number'
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
