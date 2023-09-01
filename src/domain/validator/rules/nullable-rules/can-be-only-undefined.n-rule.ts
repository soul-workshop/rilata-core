import { ValidationRule } from '../validation-rule';
import { EmptyValueRuleAnswer } from '../types';

export class CanBeUndefinedValidationRule extends ValidationRule<'nullable', unknown> {
  requirement = 'Значение может быть undefined';

  validate(value: unknown): EmptyValueRuleAnswer {
    return value === undefined
      ? this.returnSuccess('BreakValidation')
      : this.returnSuccess('RunNextRule');
  }
}
