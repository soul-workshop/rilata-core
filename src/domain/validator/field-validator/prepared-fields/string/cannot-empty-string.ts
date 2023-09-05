import { CannotBeEmptyStringAssertionRule } from '../../../rules/assert-rules/cannot-be-empty-string.v-rule';
import { LeadRule } from '../../../rules/lead-rule';
import { ValidationRule } from '../../../rules/validation-rule';
import { LiteralFieldValidator } from '../../literal-field-validator';

export class CannotEmptyStringField<
  REQ extends boolean
> extends LiteralFieldValidator<REQ, false, string> {
  constructor(
    required: REQ,
    protected validateRules: ValidationRule<'validate', string>[],
    protected leadRules: LeadRule<string>[] = [],
  ) {
    super(
      'string',
      required,
      { isArray: false },
      [new CannotBeEmptyStringAssertionRule(), ...validateRules],
      leadRules,
    );
  }
}
