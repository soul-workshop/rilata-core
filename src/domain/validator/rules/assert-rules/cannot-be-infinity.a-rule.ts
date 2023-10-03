import { ValidationRule } from '../validation-rule';
import { TypeOrAssertRuleAnswer } from '../types';

export class CannotBeInfinityRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение не должно быть Infinity';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return value !== Infinity
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}