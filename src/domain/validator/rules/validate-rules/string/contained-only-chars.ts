import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class ContainedOnlyCharsValidationRule extends ValidationRule<'validate', string> {
  requirement = 'Строка должна содержать только {{onlyChars}}';

  constructor(private onlyChars: string, requirement?: string) {
    super();
    if (requirement) this.requirement = requirement;
  }

  validate(value: string): ValidationRuleAnswer {
    // eslint-disable-next-line no-restricted-syntax
    for (const char of value) {
      if (!this.onlyChars.includes(char)) {
        return this.returnFail('SaveErrorAndRunNextRule');
      }
    } return this.returnSuccess('RunNextRule');
  }
}
