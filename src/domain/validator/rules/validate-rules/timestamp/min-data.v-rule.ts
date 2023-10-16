import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class MinDateStampValidationRule extends ValidationRule<'validate', number> {
  requirement = 'Дата должно быть позже {{minDate}}';

  private minDateAsTimestamp: number;

  constructor(minDate: Date) {
    super();
    this.minDateAsTimestamp = minDate.getTime();
  }

  validate(value: number): ValidationRuleAnswer {
    return value >= this.minDateAsTimestamp
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { minDate: this.minDateAsTimestamp });
  }
}
