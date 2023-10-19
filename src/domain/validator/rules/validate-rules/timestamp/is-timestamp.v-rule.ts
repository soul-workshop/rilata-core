import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class IsTimeStampValidationRule extends ValidationRule<'validate', number> {
  requirement = 'Значение не является датой';

  validate(value: number): ValidationRuleAnswer {
    return (new Date(value)).getTime() > 0
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule');
  }
}
