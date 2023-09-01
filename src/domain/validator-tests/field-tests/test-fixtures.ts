import { DODPrivateFixtures as DodFixtures } from '../../../domain/domain-object/dod-private-fixtures';
import { LetaralFieldValidator } from '../../validator/field-validator/field-validator';
import { TrimStringLeadRule } from '../../validator/rules/lead-rules/string/trim';
import { RegexFormatValidationRule } from '../../validator/rules/validate-rules/string/regex.field-v-rule';

export namespace FieldValidatorPrivateFixtures {
  export class PhoneNumberFieldValidator extends LetaralFieldValidator<true, true, string> {
    protected dataType: 'string' = 'string';

    constructor() {
      super(
        true,
        { isArray: true, mustBeFilled: true },
        [
          new RegexFormatValidationRule(
            /^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/,
            'Строка должна соответствовать формату: "+7-###-##-##"',
          ),
        ],
        [new TrimStringLeadRule()],
      );
    }
  }
}
