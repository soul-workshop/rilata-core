import { dtoUtility } from '../../../../../common/utils/dto';
import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../../types';
import { DefaultFieldValidationRule } from '../default.field-v-rule';

export const isDTORuleExplanation = 'ValueMustBeDTO';

export class IsDTOFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isDTORuleExplanation;

  validate(value: unknown): FieldValidationRuleResult {
    return dtoUtility.isDTO(value)
      ? {
        behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
      }
      : {
        behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndBreakFieldValidation,
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [],
        },
      };
  }
}
