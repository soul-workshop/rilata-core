import { ValidationRuleAnswer } from '../../types';
import { RegexFormatValidationRule } from './regex.field-v-rule';

export class NoContanedSpaсeValidationRule extends RegexFormatValidationRule {
  constructor() {
    super(/\s+/g, 'Не должно быть пробелов');
  }

  validate(value: string): ValidationRuleAnswer {
    return this.regex.test(value)
      ? this.returnFail('SaveErrorAndRunNextRule')
      : this.returnSuccess('RunNextRule');
  }
}
