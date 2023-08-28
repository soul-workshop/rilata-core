import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../types';
import { DefaultFieldValidationRule } from './default.field-v-rule';

export const optionalEmptyArrayMustBeUndefinedRule = 'OptionalEmptyArrayMustBeUndefined';

/**
 * Если это правило запущено в проверку, значит проверяемое значение может быть
 * пустым (undefined). И, в случае пустоты значения, нужно отменить проверку
 * дальнейших правил этого поля, так как это не имеет смысла.
 */
export class CanBeEmptyFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = optionalEmptyArrayMustBeUndefinedRule;

  validate(value: unknown): FieldValidationRuleResult {
    if (Array.isArray(value) && value.length === 0) {
      return {
        behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndBreakFieldValidation,
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [],
        },
      };
    }

    return value === undefined
      ? {
        behaviour: FieldValidationRuleResultBehaviour.BreakFieldValidation,
      }
      : {
        behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
      };
  }
}
