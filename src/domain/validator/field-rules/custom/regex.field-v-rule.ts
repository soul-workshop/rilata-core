import { AssertionException } from '../../../../common/types';
import { FieldValidationRuleResult } from '../types';
import { CustomFieldValidationRule } from './custom.field-v-rule';

export abstract class RegexFormatFieldRule extends CustomFieldValidationRule {
  protected abstract regex: RegExp;

  validate(value: unknown): FieldValidationRuleResult {
    this.throwIfValueIsNotString(value);
    return this.regex.test(value)
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
      throw new AssertionException('В RegexFormatFieldRule передана не строка');
    }
  }
}
