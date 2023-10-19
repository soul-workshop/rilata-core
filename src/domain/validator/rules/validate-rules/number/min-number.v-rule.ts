import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class MinNumberValidationRule extends ValidationRule<'validate', number> {
  requirement = 'Число должно быть больше или равно {{min}}';

  constructor(private minNumber: number) {
    super();
  }

  validate(value: number): ValidationRuleAnswer {
    return value >= this.minNumber
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { min: this.minNumber });
  }
}
