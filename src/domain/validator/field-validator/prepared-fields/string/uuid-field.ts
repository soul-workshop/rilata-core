import { UUIDFormatValidationRule } from '../../../rules/prepared-rules/string/uuid-format.v-rule';
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
