import { StringChoiceValidationRule } from '../../../rules/validate-rules/string/string-choice.v-rule';
import { LiteralFieldValidator } from '../../literal-field-validator';
import { GetArrayConfig } from '../../types';

export class StringChoiceFieldValidator<
  NAME extends string, REQ extends boolean, IS_ARR extends boolean
> extends LiteralFieldValidator<NAME, REQ, IS_ARR, string> {
  constructor(attrName: NAME, required: REQ, isArray: GetArrayConfig<IS_ARR>, choice: string[]) {
    super(attrName, 'string', required, isArray, [new StringChoiceValidationRule(choice)]);
  }
}
