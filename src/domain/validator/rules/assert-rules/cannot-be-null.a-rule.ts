import { ValidationRule } from '../validation-rule';
import { TypeOrAssertRuleAnswer } from '../types';

export class CannotBeNullValidationRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение не может быть равным null';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return value !== null
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
