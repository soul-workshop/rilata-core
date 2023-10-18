import { ValidationRule } from '../validation-rule';
import { EmptyValueRuleAnswer } from '../types';

export class CanBeNullValidationRule extends ValidationRule<'nullable', unknown> {
  requirement = 'Значение может быть равным null';

  validate(value: unknown): EmptyValueRuleAnswer {
    return value === null
      ? this.returnSuccess('SuccessBreakValidation')
      : this.returnSuccess('SuccessRunNextRule');
  }
}
