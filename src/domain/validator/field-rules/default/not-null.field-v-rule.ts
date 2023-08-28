import { FieldValidationRuleResult } from '../types';
import { DefaultFieldValidationRule } from './default.field-v-rule';

export const notNullRuleExplanation = 'ValueMustNotBeNull';

export class NotNullFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = notNullRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    return value === null
      ? {
        behaviour: 'SaveErrorAndBreakFieldValidation',
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [],
        },
      }
      : {
        behaviour: 'RunNextRule',
      };
  }
}
