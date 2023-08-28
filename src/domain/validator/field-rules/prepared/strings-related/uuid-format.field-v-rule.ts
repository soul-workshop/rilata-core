import { AssertionException } from '../../../../../common/exceptions';
import { UUIDUtility } from '../../../../../common/utils/uuid/uuid-utility';
import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../../types';
import { PreparedFieldValidationRule } from '../prepared.field-v-rule';

export const uuidFormatRuleExplanation = 'StringMustBeInUUIDFormat';

export class UUIDFormatFieldRule extends PreparedFieldValidationRule {
  ruleExplanation = uuidFormatRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    this.throwIfValueIsNotString(value);
    return UUIDUtility.isValidValue(value)
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
      throw new AssertionException('В UUIDFormatFieldRule передана не строка');
    }
  }
}
