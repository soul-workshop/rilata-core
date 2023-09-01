import { ValidationRule } from '../validation-rule';
import { TypeOrAssertRuleAnswer } from '../types';

export class IsStringTypeRule extends ValidationRule<'type', unknown> {
  requirement = 'Значение должно быть строковым значением';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return typeof value === 'string'
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
