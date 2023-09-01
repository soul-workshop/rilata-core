import { LeadRule } from '../../lead-rule';

export class MathFloorLeadRule implements LeadRule<number> {
  lead(value: number): number {
    return Math.floor(value);
  }
}
