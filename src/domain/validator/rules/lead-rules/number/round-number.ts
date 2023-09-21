import { numberUtility } from '../../../../../common/utils/number/number-utility';
import { LeadRule } from '../../lead-rule';

export class RoundNumberLeadRule implements LeadRule<number> {
  constructor(protected digitsAfterDot: number) {
  }

  lead(value: number): number {
    return numberUtility.round(value, this.digitsAfterDot);
  }
}
