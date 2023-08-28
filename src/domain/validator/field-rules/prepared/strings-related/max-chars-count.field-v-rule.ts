import { AssertionException } from '../../../../../common/exceptions';
import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../../types';
import { PreparedFieldValidationRule } from '../prepared.field-v-rule';

export const maxCharsCountRuleExplanation = 'CharsMustBeLessCount';

export class MaxCharsCountFieldRule extends PreparedFieldValidationRule {
  ruleExplanation = maxCharsCountRuleExplanation;

  private maxCharsCount: number;

  constructor(maxCharsCount: number) {
    super();
    this.maxCharsCount = maxCharsCount;
  }

  validate(value: unknown): FieldValidationRuleResult {
    this.throwIfValueIsNotString(value);
    return value.length > this.maxCharsCount
      ? {
        behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndRunNextRule,
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [
            { maxCharsCount: this.maxCharsCount },
          ],
        },
      }
      : {
        behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
      };
  }

  private throwIfValueIsNotString(value: unknown): asserts value is string {
    if (typeof value !== 'string') {
      throw new AssertionException('В MaxCharsCountFieldRule передана не строка');
    }
  }
}
