import { FieldValidationRuleResult } from '../../types';
import { DefaultFieldValidationRule } from '../default.field-v-rule';

export const isStringArrayRuleExplanation = 'ValueMustBeArrayOfStrings';

export class IsStringArrayFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isStringArrayRuleExplanation;

  validate(value: Array<unknown>): FieldValidationRuleResult {
    return (value.every((elem) => typeof elem === 'string'))
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
