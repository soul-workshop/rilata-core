import { ValidatableDTO } from '../../types';
import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../types';
import { DefaultFieldValidationRule } from './default.field-v-rule';

export const notSpecifiedDTOArrayAttrsRuleExplanation = 'AttrsNotSpecifiedInValidatorMapAreForbidden';

export class NotSpecifiedDTOAttrsFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = notSpecifiedDTOArrayAttrsRuleExplanation;

  private permittedKeys: string[];

  constructor(permittedKeys: string[]) {
    super();
    this.permittedKeys = permittedKeys;
  }

  validate(value: ValidatableDTO): FieldValidationRuleResult {
    const forbiddenKeys = Object.keys(value)
      .filter((dtoKey) => !this.permittedKeys.includes(dtoKey));
    return forbiddenKeys.length === 0
      ? {
        behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
      }
      : {
        behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndBreakFieldValidation,
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [
            { permittedKeys: this.permittedKeys },
            { forbiddenKeys },
          ],
        },
      };
  }
}
