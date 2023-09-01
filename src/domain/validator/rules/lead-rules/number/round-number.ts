import { numberUtility } from '../../../../../common/utils/number/number-utility';
import { LeadRule } from '../../lead-rule';

export class RoundNumberLeadRule implements LeadRule<number> {
  private factor: number;

  constructor(digitsAfterDot: number) {
    this.factor = 10 ** digitsAfterDot;
  }

  lead(value: number): number {
    return numberUtility.round(value, this.factor);
  }
}
