import { ValidationRule } from '../validation-rule';
import { TypeOrAssertRuleAnswer } from '../types';

export class IsNumberTypeRule extends ValidationRule<'type', unknown> {
  requirement = 'Значение должно быть числовым';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return typeof value === 'number'
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
