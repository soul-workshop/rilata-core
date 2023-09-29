import { StrictEqualValidationRule } from '../../../rules/validate-rules/string/strict-equal.v-rule';
import { LiteralFieldValidator } from '../../literal-field-validator';

export class StrictEqualFieldValidator<NAME extends string>
  extends LiteralFieldValidator<NAME, true, false, string> {
  constructor(attrName: NAME, strictString: string) {
    super(attrName, true, { isArray: false }, 'string', [new StrictEqualValidationRule(strictString)]);
  }
}
