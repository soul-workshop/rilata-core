import { StrictEqualValidationRule } from '../../../rules/validate-rules/string/strict-equal.v-rule';
import { LiteralFieldValidator } from '../../literal-field-validator';

export class StrictEqualFieldValidator<S extends string>
  extends LiteralFieldValidator<true, false, string> {
  constructor(strictString: S) {
    super('string', true, { isArray: false }, [new StrictEqualValidationRule(strictString)]);
  }
}
