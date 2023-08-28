import { AssertionException } from '../../../../common/exceptions';
import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../types';
import { DefaultFieldValidationRule } from './default.field-v-rule';

export const maxArrayElementsCountRuleExplanation = 'ArrayMustHasLessElementsCountRule';

export class MaxArrayElementsCountFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = maxArrayElementsCountRuleExplanation;

  private maxElementsCount: number;

  constructor(maxElementsCount: number) {
    super();
    this.maxElementsCount = maxElementsCount;
  }

  validate(value: unknown): FieldValidationRuleResult {
    this.throwIfValueIsNotArray(value);
    return value.length > this.maxElementsCount
      ? {
        behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndBreakFieldValidation,
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [{
            maxElementsCount: this.maxElementsCount,
          }],
        },
      }
      : {
        behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
      };
  }

  private throwIfValueIsNotArray(value: unknown): asserts value is string {
    if (!Array.isArray(value)) {
      throw new AssertionException('В MaxArrayElementsCountFieldRule передан не массив');
    }
  }
}
