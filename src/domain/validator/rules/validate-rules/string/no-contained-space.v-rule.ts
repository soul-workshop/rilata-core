import { RegexFormatValidationRule } from './regex.field-v-rule';

export class NoContanedSpaсeValidationRule extends RegexFormatValidationRule {
  constructor() {
    super(/^\S*$/, 'Не должно быть пробелов');
  }
}
