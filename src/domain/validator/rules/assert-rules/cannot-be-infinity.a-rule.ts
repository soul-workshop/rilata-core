import { ValidationRule } from '../validation-rule';
import { TypeOrAssertRuleAnswer } from '../types';

export class CannotBeInfinityRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение не может быть Infinity или -Infinity';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return value !== Infinity && value !== -Infinity
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}