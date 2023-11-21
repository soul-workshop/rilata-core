import { RegexFormatValidationRule } from './regex.field-v-rule';

export class NoContainedSpaceValidationRule extends RegexFormatValidationRule {
  constructor() {
    super(/^\S*$/, 'Не должно быть пробелов');
  }
}
