import { dtoUtility } from '../../../../../common/utils/dto';
import { FieldValidationRuleResult } from '../../types';
import { DefaultFieldValidationRule } from '../default.field-v-rule';

export const isDTOArrayRuleExplanation = 'ValueMustBeArrayOfDTOs';

export class IsDTOArrayFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = isDTOArrayRuleExplanation;

  validate(value: Array<unknown>): FieldValidationRuleResult {
    return (value.every((elem) => dtoUtility.isDTO(elem)))
      ? {
        behaviour: 'RunNextRule',
      }
      : {
        behaviour: 'SaveErrorAndBreakFieldValidation',
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [],
        },
      };
  }
}
