import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class StrictEqualValidationRule extends ValidationRule<'validate', string> {
  requirement = 'write here requirement text';

  constructor(private strictString: string) {
    super();
  }

  validate(value: string): ValidationRuleAnswer {
    throw new Error('Method not implemented.');
  }
}
