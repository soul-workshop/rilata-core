import { CannotBeEmptyStringAssertionRule } from '../../../rules/assert-rules/cannot-be-empty-string.v-rule';
import { ValidationRule } from '../../../rules/validation-rule';
import { LiteralFieldValidator } from '../../literal-field-validator';

export class CannotEmptyStringField<
  NAME extends string, REQ extends boolean
> extends LiteralFieldValidator<NAME, REQ, false, string> {
  constructor(
    attrName: NAME,
    required: REQ,
    protected validateRules: ValidationRule<'validate', string>[],
  ) {
    super(
      attrName,
      required,
      { isArray: false },
      'string',
      [new CannotBeEmptyStringAssertionRule(), ...validateRules],
    );
  }
}
