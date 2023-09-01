import { ValidationRuleAnswer } from '../../types';
import { NumberValidationRule } from './number.v-rule';

export class MaxNumberValidationRule extends NumberValidationRule {
  requirement = 'Число должно быть меньше или равно {{max}}';

  constructor(private maxNumber: number) {
    super();
  }

  validate(value: number): ValidationRuleAnswer {
    return value <= this.maxNumber
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { max: this.maxNumber });
  }
}
