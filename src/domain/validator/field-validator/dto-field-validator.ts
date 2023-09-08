import { failure } from '../../../common/result/failure';
import { success } from '../../../common/result/success';
import { DTO } from '../../dto';
import { FieldValidator } from './field-validator';
import {
  DtoFieldErrors, FieldValidatorResult, GetArrayConfig, GetFieldValidatorDataType, ValidatorMap,
} from './types';

export class DtoFieldValidator<
  REQ extends boolean, IS_ARR extends boolean, DTO_TYPE extends DTO
> extends FieldValidator<REQ, IS_ARR, DTO_TYPE> {
  constructor(
    dataType: GetFieldValidatorDataType<DTO_TYPE>,
    required: REQ,
    arrayConfig: GetArrayConfig<IS_ARR>,
    protected dtoMap: ValidatorMap<DTO_TYPE>,
  ) {
    super(dataType, required, arrayConfig);
  }

  protected validateValue(attrName: string, value: unknown): FieldValidatorResult {
    const preValidateAnswer = this.validateOnNullableAntType(value);
    if (preValidateAnswer.break) {
      return preValidateAnswer.isValidValue
        ? success(undefined)
        : this.getFailResult(attrName, preValidateAnswer.errors);
    }

    let errors: DtoFieldErrors = {};
    Object.entries(this.dtoMap).forEach(([dtoAttrName, validator]) => {
      if (validator instanceof FieldValidator) {
        const result = validator.validate(attrName, (value as DTO_TYPE)[dtoAttrName]);
        if (result.isFailure()) {
          errors = { ...errors, ...result.value };
        }
      }
    });

    return Object.keys(errors).length > 0
      ? failure(errors)
      : success(undefined);
  }
}
