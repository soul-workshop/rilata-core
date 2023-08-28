import { FieldValidationRuleResult } from '../../types';
import { DefaultFieldValidationRule } from '../default.field-v-rule';

export const isBooleanArrayRuleExplanation = 'ValueMustBeArrayOfBooleans';

export class IsBooleanArrayFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isBooleanArrayRuleExplanation;

  validate(value: Array<unknown>): FieldValidationRuleResult {
    return (value.every((elem) => typeof elem === 'boolean'))
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
