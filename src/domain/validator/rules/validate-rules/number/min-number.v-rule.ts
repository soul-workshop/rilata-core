import { ValidationRuleAnswer } from '../../types';
import { NumberValidationRule } from './number.v-rule';

export class MinNumberValidationRule extends NumberValidationRule {
  requirement = 'Число должно быть больше или равно {{min}}';

  constructor(private minNumber: number) {
    super();
  }

  validate(value: number): ValidationRuleAnswer {
    return value >= this.minNumber
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { min: this.minNumber });
  }
}
