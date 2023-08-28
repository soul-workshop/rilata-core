import { AssertionException } from '../../../../../common/types';
import { FieldValidationRuleResult } from '../../types';
import { PreparedFieldValidationRule } from '../prepared.field-v-rule';

export const minCharsCountRuleExplanation = 'CharsMustBeMoreCount';

export class MinCharsCountFieldRule extends PreparedFieldValidationRule {
  ruleExplanation = minCharsCountRuleExplanation;

  private minCharsCount: number;

  constructor(minCharsCount: number) {
    super();
    this.minCharsCount = minCharsCount;
  }

  validate(value: unknown): FieldValidationRuleResult {
    this.throwIfValueIsNotString(value);
    return value.length < this.minCharsCount
      ? {
        behaviour: 'SaveErrorAndRunNextRule',
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [
            { minCharsCount: this.minCharsCount },
          ],
        },
      }
      : {
        behaviour: 'RunNextRule',
      };
  }

  private throwIfValueIsNotString(value: unknown): asserts value is string {
    if (typeof value !== 'string') {
      throw new AssertionException('В MinCharsCountFieldRule передана не строка');
    }
  }
}
