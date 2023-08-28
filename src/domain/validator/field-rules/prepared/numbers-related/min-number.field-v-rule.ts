import { AssertionException } from '../../../../../common/exceptions';
import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../../types';
import { PreparedFieldValidationRule } from '../prepared.field-v-rule';

export const minNumberRuleExplanation = 'NumberMustBeGreater';

export class MinNumberFieldRule extends PreparedFieldValidationRule {
  ruleExplanation = minNumberRuleExplanation;

  private minNumber: number;

  constructor(minNumber: number) {
    super();
    this.minNumber = minNumber;
  }

  validate(value: unknown): FieldValidationRuleResult {
    this.throwIfValueIsNotNumber(value);
    return value < this.minNumber
      ? {
        behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndRunNextRule,
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [
            { minNumber: this.minNumber },
          ],
        },
      }
      : {
        behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
      };
  }

  private throwIfValueIsNotNumber(value: unknown): asserts value is number {
    if (typeof value !== 'number') {
      throw new AssertionException('В MinNumberFieldRule передано не число');
    }
  }
}
