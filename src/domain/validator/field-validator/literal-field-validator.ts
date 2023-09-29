import { failure } from '../../../common/result/failure';
import { success } from '../../../common/result/success';
import { LeadRule } from '../../validator/rules/lead-rule';
import { LiteralDataType, RuleError } from '../../validator/rules/types';
import { ValidationRule } from '../../validator/rules/validation-rule';
import { CannotBeEmptyStringAssertionRule } from '../rules/assert-rules/cannot-be-empty-string.v-rule';
import { CannotBeNullableAssertionRule } from '../rules/assert-rules/cannot-be-nullable.a-rule';
import { CanBeNullableRule } from '../rules/nullable-rules/can-be-nullable.n-rule';
import { FieldValidator } from './field-validator';
import {
  GetArrayConfig, GetFieldValidatorDataType, FieldValidatorResult, ArrayFieldErrors,
} from './types';

export class LiteralFieldValidator<
  NAME extends string,
  REQ extends boolean,
  IS_ARR extends boolean,
  DATA_TYPE extends LiteralDataType
> extends FieldValidator<NAME, REQ, IS_ARR, DATA_TYPE> {
  constructor(
    attrName: NAME,
    isRequired: REQ,
    arrayConfig: GetArrayConfig<IS_ARR>,
    protected dataType: GetFieldValidatorDataType<DATA_TYPE>,
    protected validateRules: ValidationRule<'validate', DATA_TYPE>[],
    protected leadRules: LeadRule<DATA_TYPE>[] = [],
  ) {
    super(attrName, isRequired, arrayConfig, dataType);
  }

  protected validateValue(value: unknown): FieldValidatorResult {
    const typeAnswer = this.validateByRules(value, this.getTypeCheckRules());
    if (typeAnswer.isValidValue === false) this.getFailResult(typeAnswer.errors);

    const leadedValue = this.leadRules.reduce(
      (newValue, leadRule) => leadRule.lead(newValue as DATA_TYPE),
      value,
    );
    const validateAnswer = this.validateByRules(leadedValue, this.validateRules);
    return validateAnswer.isValidValue
      ? success(undefined)
      : this.getFailResult(validateAnswer.errors);
  }

  protected getFailResult(errors: RuleError[] | ArrayFieldErrors): FieldValidatorResult {
    return failure({ [this.attrName]: errors });
  }

  protected getRequiredRules(): ValidationRule<'assert', unknown>[] {
    if (this.dataType !== 'string') return super.getRequiredRules();
    return [new CannotBeNullableAssertionRule(), new CannotBeEmptyStringAssertionRule()];
  }
}
