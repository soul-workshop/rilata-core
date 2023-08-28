import { validate } from 'email-validator';
import { AssertionException } from '../../../../../common/types';
import { FieldValidationRuleResult } from '../../types';
import { PreparedFieldValidationRule } from '../prepared.field-v-rule';

export const emailFormatRuleExplanation = 'StringMustBeInEmailFormat';

export class EmailFormatFieldRule extends PreparedFieldValidationRule {
  ruleExplanation = emailFormatRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    this.throwIfValueIsNotString(value);
    return validate(value)
      ? {
        behaviour: 'RunNextRule',
      }
      : {
        behaviour: 'SaveErrorAndRunNextRule',
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
