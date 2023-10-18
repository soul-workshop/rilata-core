import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class PositiveNumberValidationRule extends ValidationRule<'validate', number> {
  requirement = 'Число должно быть положительным';

  validate(value: number): ValidationRuleAnswer {
    return value >= 0
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule');
  }
}
