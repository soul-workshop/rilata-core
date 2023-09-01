import { ValidationRule } from '../validation-rule';
import { TypeOrAssertRuleAnswer } from '../types';

export class CannotBeNullableAssertionRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение не должно быть undefined или null';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return value !== undefined && value !== null
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
