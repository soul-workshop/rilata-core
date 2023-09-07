import { UUIDFormatValidationRule } from '../../../rules/validate-rules/string/uuid-format.v-rule';
import { LiteralFieldValidator } from '../../literal-field-validator';

export class UuidField extends LiteralFieldValidator<true, false, string> {
  constructor() {
    super(
      'string',
      true,
      { isArray: false },
      [new UUIDFormatValidationRule()],
    );
  }
}
