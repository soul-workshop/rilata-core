import { dtoUtility } from '../../../../../common/utils/dto';
import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../../types';
import { DefaultFieldValidationRule } from '../default.field-v-rule';

export const isDTOArrayRuleExplanation = 'ValueMustBeArrayOfDTOs';

export class IsDTOArrayFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isDTOArrayRuleExplanation;

  validate(value: Array<unknown>): FieldValidationRuleResult {
    return (value.every((elem) => dtoUtility.isDTO(elem)))
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
