import { AssertionException } from '../../../../common/exceptions';
import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../types';
import { CustomFieldValidationRule } from './custom.field-v-rule';

export abstract class RegexFormatFieldRule extends CustomFieldValidationRule {
  protected abstract regex: RegExp;

  validate(value: unknown): FieldValidationRuleResult {
    this.throwIfValueIsNotString(value);
    return this.regex.test(value)
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
      throw new AssertionException('В RegexFormatFieldRule передана не строка');
    }
  }
}
