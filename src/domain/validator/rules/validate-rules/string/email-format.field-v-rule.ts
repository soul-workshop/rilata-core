import { validate } from 'email-validator';
import { AssertionException } from '../../../../../common/types';
import { ValidationRuleAnswer } from '../../types';
import { PreparedValidationRule } from '../prepared.field-v-rule';

export const emailFormatRuleExplanation = 'StringMustBeInEmailFormat';

export class EmailFormatValidationRule extends PreparedValidationRule {
  ruleExplanation = emailFormatRuleExplanation;

  validate(value: unknown): ValidationRuleAnswer {
    this.throwIfValueIsNotString(value);
    return validate(value)
      ? {
        behaviour: 'RunNextRule',
      }
      : {
        behaviour: 'SaveErrorAndRunNextRule',
        ruleError: {
          requirement: this.ruleExplanation,
          ruleHints: [],
        },
      };
  }

  private throwIfValueIsNotString(value: unknown): asserts value is string {
    if (typeof value !== 'string') {
      throw new AssertionException('В EmailFormatFieldRule передана не строка');
    }
  }
}
