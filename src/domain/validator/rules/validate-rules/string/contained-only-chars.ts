import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class ContainedOnlyCharsValidationRule extends ValidationRule<'validate', string> {
  requirement = 'insert here requirement string';

  validate(value: string): ValidationRuleAnswer {
    throw new Error('Method not implemented.');
  }
}
