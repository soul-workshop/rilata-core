import { ValidationRule } from '../validation-rule';
import { TypeOrAssertRuleAnswer } from '../types';

export class IsDTOTypeRule extends ValidationRule<'type', unknown> {
  requirement = 'Значение должно быть объектом';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return (
      typeof value === 'object'
      && Array.isArray(value) === false
      && value !== null
    )
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
