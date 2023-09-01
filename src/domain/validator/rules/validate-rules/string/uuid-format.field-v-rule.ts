import { AssertionException } from '../../../../../common/types';
import { UUIDUtility } from '../../../../../common/utils/uuid/uuid-utility';
import { ValidationRuleAnswer } from '../../types';
import { PreparedValidationRule } from '../prepared.field-v-rule';

export const uuidFormatRuleExplanation = 'StringMustBeInUUIDFormat';

export class UUIDFormatValidationRule extends PreparedValidationRule {
  ruleExplanation = uuidFormatRuleExplanation;

  validate(value: unknown): ValidationRuleAnswer {
    this.throwIfValueIsNotString(value);
    return UUIDUtility.isValidValue(value)
      ? {
        behaviour: 'RunNextRule',
      }
      : {
        behaviour: 'SaveErrorAndRunNextRule',
        ruleError: {
          requirement: this.ruleExplanation,
          ruleHints: [],
        },
      };
  }

  private throwIfValueIsNotString(value: unknown): asserts value is string {
    if (typeof value !== 'string') {
      throw new AssertionException('В UUIDFormatFieldRule передана не строка');
    }
  }
}
