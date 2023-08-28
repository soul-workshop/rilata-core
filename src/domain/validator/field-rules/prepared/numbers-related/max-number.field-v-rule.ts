import { AssertionException } from '../../../../../common/types';
import { FieldValidationRuleResult } from '../../types';
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
        behaviour: 'SaveErrorAndRunNextRule',
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [
            { maxNumber: this.maxNumber },
          ],
        },
      }
      : {
        behaviour: 'RunNextRule',
      };
  }

  private throwIfValueIsNotNumber(value: unknown): asserts value is number {
    if (typeof value !== 'number') {
      throw new AssertionException('В MaxNumberFieldRule передано не число');
    }
  }
}
