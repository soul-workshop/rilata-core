import { ValidationRule } from '../validation-rule';
import { TypeOrAssertRuleAnswer } from '../types';

export class CannotBeUndefinedValidationRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение не должно быть undefined';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return value !== undefined
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
