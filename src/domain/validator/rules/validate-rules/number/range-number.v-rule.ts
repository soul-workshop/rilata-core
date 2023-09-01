import { ValidationRuleAnswer } from '../../types';
import { NumberValidationRule } from './number.v-rule';

export class MustBeInRangeNumberValidationRule extends NumberValidationRule {
  requirement = 'Число должно быть в диапозоне от {{min}} до {{max}}';

  constructor(private min: number, private max: number) {
    super();
  }

  validate(value: number): ValidationRuleAnswer {
    return value >= this.min && value <= this.max
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { max: this.max, min: this.min });
  }
}
