import { AssertionException } from '../../../../../common/exceptions';
import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../../types';
import { PreparedFieldValidationRule } from '../prepared.field-v-rule';

export const maxNumberRuleExplanation = 'NumberMustBeLess';

export class MaxNumberFieldRule extends PreparedFieldValidationRule {
  ruleExplanation = maxNumberRuleExplanation;

  private maxNumber: number;

  constructor(maxNumber: number) {
    super();
    this.maxNumber = maxNumber;
  }

  validate(value: unknown): FieldValidationRuleResult {
    this.throwIfValueIsNotNumber(value);
    return value > this.maxNumber
      ? {
        behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndRunNextRule,
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [
            { maxNumber: this.maxNumber },
          ],
        },
      }
      : {
        behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
      };
  }

  private throwIfValueIsNotNumber(value: unknown): asserts value is number {
    if (typeof value !== 'number') {
      throw new AssertionException('В MaxNumberFieldRule передано не число');
    }
  }
}
