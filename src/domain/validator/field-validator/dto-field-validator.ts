import { failure } from '../../../common/result/failure';
import { success } from '../../../common/result/success';
import { DTO } from '../../dto';
import { RuleError } from '../rules/types';
import { FieldValidator } from './field-validator';
import {
  ArrayFieldErrors, DtoFieldErrors, FieldValidatorResult, GetArrayConfig,
  GetFieldValidatorDataType, ValidatorMap,
} from './types';

export class DtoFieldValidator<
  NAME extends string,
  REQ extends boolean,
  IS_ARR extends boolean,
  DTO_TYPE extends DTO
> extends FieldValidator<NAME, REQ, IS_ARR, DTO_TYPE> {
  constructor(
    attrName: NAME,
    required: REQ,
    arrayConfig: GetArrayConfig<IS_ARR>,
    dataType: GetFieldValidatorDataType<DTO_TYPE>,
    protected dtoMap: ValidatorMap<DTO_TYPE>,
  ) {
    super(attrName, required, arrayConfig, dataType);
  }

  protected validateValue(value: unknown): FieldValidatorResult {
    const typeAnswer = this.validateByRules(value, this.getTypeCheckRules());
    if (typeAnswer.isValidValue === false) this.getFailResult(typeAnswer.errors);

    let errors: DtoFieldErrors = {};
    Object.entries(this.dtoMap).forEach(([dtoAttrName, validator]) => {
      if (validator instanceof FieldValidator) {
        const result = validator.validate((value as DTO_TYPE)[dtoAttrName]);
        if (result.isFailure()) {
          errors = { ...errors, ...result.value };
        }
      }
    });

    return Object.keys(errors).length > 0
      ? failure(errors)
      : success(undefined);
  }

  protected getFailResult(errors: RuleError[] | ArrayFieldErrors): FieldValidatorResult {
    return failure({ [FieldValidator.WHOLE_VALUE_VALIDATION_ERROR_KEY]: errors });
  }
}
