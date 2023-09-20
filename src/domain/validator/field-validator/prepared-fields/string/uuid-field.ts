import { UUIDFormatValidationRule } from '../../../rules/validate-rules/string/uuid-format.v-rule';
import { LiteralFieldValidator } from '../../literal-field-validator';

export class UuidField<N extends string> extends LiteralFieldValidator<N, true, false, string> {
  constructor(attrName: N) {
    super(
      attrName,
      'string',
      true,
      { isArray: false },
      [new UUIDFormatValidationRule()],
    );
  }
}
