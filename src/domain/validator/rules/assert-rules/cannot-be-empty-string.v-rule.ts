import { TypeOrAssertRuleAnswer } from '../types';
import { ValidationRule } from '../validation-rule';

export class CannootBeEmptyStringAssertionRule extends ValidationRule<'assert', string> {
  requirement = 'Сротка обязательна к заполнению';

  validate(value: string): TypeOrAssertRuleAnswer {
    return value !== ''
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
