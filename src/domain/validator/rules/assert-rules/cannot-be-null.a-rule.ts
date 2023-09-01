import { ValidationRule } from '../validation-rule';
import { TypeOrAssertRuleAnswer } from '../types';

export class CannotNullValidationRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение не может иметь значение null';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return value !== null
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
