import { ValidationRule } from '../validation-rule';
import { TypeOrAssertRuleAnswer } from '../types';

export class IsArrayTypeRule extends ValidationRule<'type', unknown> {
  requirement = 'Значение должно быть массивом данных';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return Array.isArray(value)
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
