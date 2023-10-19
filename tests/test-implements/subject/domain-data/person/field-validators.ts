import { LiteralFieldValidator } from '../../../../../src/domain/validator/field-validator/literal-field-validator';
import { GetArrayConfig } from '../../../../../src/domain/validator/field-validator/types';
import { LeadRule } from '../../../../../src/domain/validator/rules/lead-rule';
import { TrimStringLeadRule } from '../../../../../src/domain/validator/rules/lead-rules/string/trim';
import { GeneralValidationRule } from '../../../../../src/domain/validator/rules/types';
import { RegexFormatValidationRule } from '../../../../../src/domain/validator/rules/validate-rules/string/regex.field-v-rule';

export class PhoneNumberFieldValidator<
  NAME extends string, REQ extends boolean, IS_ARR extends boolean,
> extends LiteralFieldValidator<NAME, REQ, IS_ARR, string> {
  constructor(
    attrName: NAME,
    required: REQ,
    isArray: GetArrayConfig<IS_ARR>,
    vRules: GeneralValidationRule[],
    lRules: LeadRule<string>[] = [],
  ) {
    super(
      attrName,
      required,
      isArray,
      'string',
      [
        new RegexFormatValidationRule(
          /^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/,
          'Строка должна соответствовать формату: "+7-###-##-##"',
        ),
        ...vRules,
      ],
      [new TrimStringLeadRule(), ...lRules],
    );
  }
}
