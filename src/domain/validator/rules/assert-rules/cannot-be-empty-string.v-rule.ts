import { TypeOrAssertRuleAnswer } from '../types';
import { ValidationRule } from '../validation-rule';

export class CannotBeEmptyStringAssertionRule extends ValidationRule<'assert', string> {
  requirement = 'Сротка обязательна к заполнению';

  validate(value: string): TypeOrAssertRuleAnswer {
    return value !== ''
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
