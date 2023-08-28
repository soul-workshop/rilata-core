import { validate } from 'email-validator';
import { AssertionException } from '../../../../../common/exceptions';
import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../../types';
import { PreparedFieldValidationRule } from '../prepared.field-v-rule';

export const emailFormatRuleExplanation = 'StringMustBeInEmailFormat';

export class EmailFormatFieldRule extends PreparedFieldValidationRule {
  ruleExplanation = emailFormatRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    this.throwIfValueIsNotString(value);
    return validate(value)
      ? {
        behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
      }
      : {
        behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndRunNextRule,
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [],
        },
      };
  }

  private throwIfValueIsNotString(value: unknown): asserts value is string {
    if (typeof value !== 'string') {
      throw new AssertionException('В EmailFormatFieldRule передана не строка');
    }
  }
}
