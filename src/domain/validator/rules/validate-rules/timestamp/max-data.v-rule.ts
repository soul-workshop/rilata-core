import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class MaxDateStampValidationRule extends ValidationRule<'validate', number> {
  requirement = 'Дата должно быть раньше {{maxDate}}';

  private maxDateAsTimestamp: number;

  constructor(maxDate: Date) {
    super();
    this.maxDateAsTimestamp = maxDate.getTime();
  }

  validate(value: number): ValidationRuleAnswer {
    return (new Date(value)).getTime() < this.maxDateAsTimestamp
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { maxDate: this.maxDateAsTimestamp });
  }
}
