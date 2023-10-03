import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class NoContanedSpaseValidationRule extends ValidationRule <'validate', string> {
  requirement = '';

  private spase = /\s+/g;

  validate(value: string): ValidationRuleAnswer {
    return this.spase.test(value)
      ? this.returnFail('SaveErrorAndRunNextRule')
      : this.returnSuccess('RunNextRule');
  }
}
