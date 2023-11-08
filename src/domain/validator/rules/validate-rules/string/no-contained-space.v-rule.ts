import { RegexReturnTrueFormatValidationRule } from './regex-return-true.field-v-rule';

export class NoContanedSpaсeValidationRule extends RegexReturnTrueFormatValidationRule {
  constructor() {
    super(/^\S*$/, 'Не должно быть пробелов');
  }
}
