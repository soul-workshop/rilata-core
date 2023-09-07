import { StringChoiceValidationRule } from '../../../rules/validate-rules/string/string-choice.v-rule';
import { LiteralFieldValidator } from '../../literal-field-validator';
import { GetArrayConfig } from '../../types';

export class StringChoiceFieldValidator<
  REQ extends boolean, IS_ARR extends boolean
> extends LiteralFieldValidator<REQ, IS_ARR, string> {
  constructor(required: REQ, isArray: GetArrayConfig<IS_ARR>, choice: string[]) {
    super('string', required, isArray, [new StringChoiceValidationRule(choice)]);
  }
}
