import { ValidatableDTO } from '../../types';
import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../types';
import { DefaultFieldValidationRule } from './default.field-v-rule';
import { notSpecifiedDTOArrayAttrsRuleExplanation } from './not-specified-dto-attrs.field-v-rule';

export class NotSpecifiedDTOArrayAttrsFieldRule extends DefaultFieldValidationRule {
  ruleExplanation = notSpecifiedDTOArrayAttrsRuleExplanation;

  private permittedKeys: string[];

  constructor(permittedKeys: string[]) {
    super();
    this.permittedKeys = permittedKeys;
  }

  validate(value: Array<ValidatableDTO>): FieldValidationRuleResult {
    const forbiddenKeys: string[] = [];

    value.forEach((elem) => {
      const elemForbiddenKeys = Object.keys(elem)
        .filter((dtoKey) => !this.permittedKeys.includes(dtoKey));
      if (elemForbiddenKeys.length > 0) {
        forbiddenKeys.push(...elemForbiddenKeys);
      }
    });

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
