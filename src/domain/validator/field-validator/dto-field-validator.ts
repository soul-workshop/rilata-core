/* eslint-disable camelcase */
import { failure } from '../../../common/result/failure';
import { success } from '../../../common/result/success';
import { DTO } from '../../dto';
import { FieldValidator } from './field-validator';
import {
  ArrayFieldErrors, FieldErrors, FullFieldResult, GetArrayConfig,
  GetFieldValidatorDataType, RuleErrors, ValidatorMap,
} from './types';

export class DtoFieldValidator<
  NAME extends string,
  REQ extends boolean,
  IS_ARR extends boolean,
  DTO_TYPE extends DTO
> extends FieldValidator<NAME, REQ, IS_ARR, DTO_TYPE> {
  static DTO_WHOLE_VALUE_VALIDATION_ERROR_KEY = '___dto_whole_value_validation_error___';

  constructor(
    attrName: NAME,
    required: REQ,
    arrayConfig: GetArrayConfig<IS_ARR>,
    dataType: GetFieldValidatorDataType<DTO_TYPE>,
    protected dtoMap: ValidatorMap<DTO_TYPE>,
  ) {
    super(attrName, required, arrayConfig, dataType);
  }

  validate(value: unknown): FullFieldResult {
    const result = super.validate(value);
    const dtoWholeKey = DtoFieldValidator.DTO_WHOLE_VALUE_VALIDATION_ERROR_KEY;
    const arrayWholeKey = FieldValidator.ARRAY_WHOLE_VALUE_VALIDATION_ERROR_KEY;
    if (
      this.arrayConfig.isArray
      && result.isFailure()
      && (result.value as FieldErrors)[dtoWholeKey]
    ) {
      const { ___dto_whole_value_validation_error___, ...others } = (result.value as FieldErrors);
      return failure(
        { ...others, [arrayWholeKey]: ___dto_whole_value_validation_error___ },
      );
    }
    return result;
  }

  protected validateValue(value: unknown): FullFieldResult {
    if (this.arrayConfig.isArray === false) {
      const nullableAnswer = this.validateNullableValue(value);
      if (nullableAnswer.break) {
        return nullableAnswer.isValidValue
          ? success(undefined)
          : this.getFailResult(nullableAnswer.errors);
      }
    }

    const typeAnswer = this.validateByRules(value, this.getTypeCheckRules());
    if (typeAnswer.isValidValue === false) return this.getFailResult(typeAnswer.errors);

    let errors: FieldErrors | ArrayFieldErrors = {};
    Object.entries(this.dtoMap).forEach(([dtoAttrName, validator]) => {
      if (validator instanceof FieldValidator) {
        const result = validator.validate((value as DTO_TYPE)[dtoAttrName]);
        if (result.isFailure()) {
          errors = (
            { ...errors, ...result.value }
          );
        }
      }
    });

    return Object.keys(errors).length > 0
      ? super.getFailResult(errors)
      : success(undefined);
  }

  protected getFailResult(errors: FieldErrors | RuleErrors): FullFieldResult {
    return failure({ [DtoFieldValidator.DTO_WHOLE_VALUE_VALIDATION_ERROR_KEY]: errors });
  }
}
