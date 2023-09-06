import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class StrictEqualValidationRule<S extends string> extends ValidationRule<'validate', string> {
  requirement = 'write here requirement text';

  constructor(private strictString: S) {
    super();
  }

  validate(value: string): ValidationRuleAnswer {
    throw new Error('Method not implemented.');
  }
}
