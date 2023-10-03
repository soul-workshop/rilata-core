import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class OnlyLitinicOrCyrillicCharsValidationRule extends ValidationRule <'validate', string> {
  requirement = 'Только латиница и кирилица';

  private fsdf = /^[ а-яёa-z0-9]+$/i;

  validate(value: string): ValidationRuleAnswer {
    return this.fsdf.test(value)
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule');
  }
}
