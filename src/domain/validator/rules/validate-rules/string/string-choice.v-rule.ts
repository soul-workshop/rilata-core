import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class StringChoiceValidationRule extends ValidationRule<'validate', string> {
  requirement = 'Значение должно быть одним из значений списка';

  constructor(private choices: unknown[]) {
    super();
  }

  validate(value: string): ValidationRuleAnswer {
    return this.choices.includes(value)
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { choices: this.choices });
  }
}
