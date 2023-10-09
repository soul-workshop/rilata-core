import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class OnlyLitinicOrCyrillicCharsValidationRule extends ValidationRule <'validate', string> {
  requirement = 'В строке может быть только латиница и кирилица';

  private latinic = /^[ a-z0-9]+$/i;

  private cyrillic = /^[ а-яё0-9]+$/i;

  validate(value: string): ValidationRuleAnswer {
    return this.latinic.test(value) || this.cyrillic.test(value)
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule');
  }
}
