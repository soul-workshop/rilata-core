import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class RegexFormatValidationRule extends ValidationRule<'validate', string> {
  constructor(private regex: RegExp, public requirement: string, private hint = {}) {
    super();
  }

  validate(value: string): ValidationRuleAnswer {
    return this.regex.test(value)
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', this.hint);
  }
}
