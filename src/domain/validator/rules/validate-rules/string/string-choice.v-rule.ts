import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class StringChoiceValidationRule extends ValidationRule<'validate', string> {
  requirement = 'Значение должно быть одним из значений списка';

  constructor(private choices: Array<string> | ReadonlyArray<string>) {
    super();
  }

  validate(value: string): ValidationRuleAnswer {
    return this.choices.includes(value)
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { choices: this.choices });
  }
}
