import { stringUtility } from '../../../../../common/utils/string/string.utility';
import { LeadRule } from '../../lead-rule';

export class TrimStringLeadRule implements LeadRule<string> {
  constructor(private trimSymbols = ' \t\v') {}

  lead(value: string): string {
    return stringUtility.trim(value, this.trimSymbols);
  }
}