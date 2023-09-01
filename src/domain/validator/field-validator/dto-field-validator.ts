import { Logger } from '../../../common/logger/logger';
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

  init(attrName: string, logger: Logger): void {
    super.init(attrName, logger);
    Object.entries(this.dtoMap).forEach(([childAttrName, validator]) => {
      if (validator instanceof FieldValidator) validator.init(childAttrName, logger);
      else this.logger.error('not valid validator map', this.dtoMap);
    });
  }

  validateValue(value: unknown): FieldValidatorResult {
    const preValidateAnswer = this.preValidateValue(value);
    if (preValidateAnswer.break) {
      return preValidateAnswer.isValidValue
        ? success(true)
        : this.getFailResult(preValidateAnswer.errors);
    }

    let errors: DtoFieldErrors = {};
    Object.entries(this.dtoMap).forEach(([attrName, validator]) => {
      if (validator instanceof FieldValidator) {
        const result = validator.validateValue((value as DTO_TYPE)[attrName]);
        if (result.isFailure()) {
          errors = { ...errors, ...result.value };
        }
      }
    });

    return Object.keys(errors).length > 0
      ? failure(errors)
      : success(true);
  }
}
