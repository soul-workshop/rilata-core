import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class RegexReturnFalseFormatValidationRule extends ValidationRule<'validate', string> {
  constructor(protected regex: RegExp, public requirement: string, private hint = {}) {
    super();
  }

  validate(value: string): ValidationRuleAnswer {
    return this.regex.test(value)
      ? this.returnFail('SaveErrorAndRunNextRule', this.hint)
      : this.returnSuccess('SuccessRunNextRule');
  }
}
