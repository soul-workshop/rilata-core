import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class NoContainedCharsValidationRule extends ValidationRule <'validate', string> {
  requirement = 'Строка не должна содержать {{noChars}}';

  constructor(private noChars: string) {
    super();
  }

  validate(value: string): ValidationRuleAnswer {
    // eslint-disable-next-line no-restricted-syntax
    for (const char of this.noChars) {
      if (value.includes(char)) { return this.returnFail('SaveErrorAndRunNextRule'); }
    } return this.returnSuccess('RunNextRule');
  }
}
