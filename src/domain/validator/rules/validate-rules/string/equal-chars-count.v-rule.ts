import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class EqualCharsCountValidationRule extends ValidationRule<'validate', string> {
  requirement = 'Строка должна быть равна {{count}}';

  constructor(private charsCount: number) {
    super();
  }

  validate(value: string): ValidationRuleAnswer {
    return value.length !== this.charsCount
      ? this.returnFail('SaveErrorAndRunNextRule', { minCount: this.charsCount })
      : this.returnSuccess('RunNextRule');
  }
}
