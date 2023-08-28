import { AssertionException } from '../../../../../common/types';
import { UUIDUtility } from '../../../../../common/utils/uuid/uuid-utility';
import { FieldValidationRuleResult } from '../../types';
import { PreparedFieldValidationRule } from '../prepared.field-v-rule';

export const uuidFormatRuleExplanation = 'StringMustBeInUUIDFormat';

export class UUIDFormatFieldRule extends PreparedFieldValidationRule {
  ruleExplanation = uuidFormatRuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    this.throwIfValueIsNotString(value);
    return UUIDUtility.isValidValue(value)
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
      throw new AssertionException('В UUIDFormatFieldRule передана не строка');
    }
  }
}
