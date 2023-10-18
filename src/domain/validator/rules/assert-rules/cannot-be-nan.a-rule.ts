import { ValidationRule } from '../validation-rule';
import { TypeOrAssertRuleAnswer } from '../types';

export class CannotBeNanRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение не может быть NaN';

  validate(value: number): TypeOrAssertRuleAnswer {
    return isNaN(value)
      ? this.returnFail('SaveErrorAndBreakValidation')
      : this.returnSuccess('SuccessRunNextRule');
  }
}
