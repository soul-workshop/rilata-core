import { failure } from '../../../common/result/failure';
import { success } from '../../../common/result/success';
import { BaseFieldValidationRule } from '../field-rules/base.field-v-rule';
import { NotSpecifiedDTOArrayAttrsFieldRule } from '../field-rules/default/not-specified-dto-array-attrs.field-v-rule';
import { NotSpecifiedDTOAttrsFieldRule } from '../field-rules/default/not-specified-dto-attrs.field-v-rule';
import { FieldValidationErrors, ValidatableDTO, ValidatableType } from '../types';
import { ValidatorMap } from '../validator/types';
import {
  BaseFieldValidator, BaseFieldValidionConfig,
  BaseTypeValidationConfig, FieldInternalValidationResult,
} from './base.field-validator';
import { FieldValidatorConfig, ValidatableTypes } from './types';

export type DTOKeysValidatorMap<DTO extends ValidatableDTO> = {
  [K in keyof DTO]-?: ValidatorMap<
    NonNullable<DTO[K]>,
    undefined extends DTO[K] ? false : true
  >
};

type DTOTypeValidationConfig<DTO extends ValidatableDTO> = BaseTypeValidationConfig<
  Extract<ValidatableTypes, 'dto'>> & {
  validatorMap: DTOKeysValidatorMap<DTO>,
}

type DTOFieldValidationConfig<
  R extends boolean,
  AC extends FieldValidatorConfig<boolean>,
  DTO extends ValidatableDTO,
  DTOC extends DTOTypeValidationConfig<DTO>
> = BaseFieldValidionConfig<R, AC, DTOC>;

export class DTOFieldValidator<
  R extends boolean,
  AC extends FieldValidatorConfig<boolean>,
  DTO extends ValidatableDTO,
  DTOC extends DTOTypeValidationConfig<DTO> = DTOTypeValidationConfig<DTO>
> extends BaseFieldValidator<R, AC, DTOC> {
  constructor(config: DTOFieldValidationConfig<R, AC, DTO, DTOC>) {
    super(config);
  }

  protected validateInternal<V extends ValidatableType>(value: V): FieldInternalValidationResult {
    const parentValidResult = super.validateInternal(value);

    if (parentValidResult.value.break) {
      return parentValidResult;
    }

    const res = this.validateRules(value, this.getDTOCheckRules());
    if (parentValidResult.isFailure() && res.isFailure()) {
      return failure(
        {
          errors: [
            ...parentValidResult.value.errors as FieldValidationErrors,
            ...res.value.errors,
          ],
          break: parentValidResult.value.break || res.value.break,
        },
      );
    }
    if (parentValidResult.isFailure()) {
      return parentValidResult;
    }
    if (res.isFailure()) {
      return failure({
        errors: res.value.errors,
        break: res.value.break,
      });
    }
    return success({ break: res.value.break });
  }

  private getDTOCheckRules(): BaseFieldValidationRule[] {
    const dtoCheckRules: BaseFieldValidationRule[] = [];

    if (this.config.arrayConfig.isArray) {
      dtoCheckRules.push(
        new NotSpecifiedDTOArrayAttrsFieldRule(
          Object.keys(
            (this.config.typeConfig as unknown as DTOTypeValidationConfig<ValidatableDTO>)
              .validatorMap,
          ),
        ),
      );
    } else {
      dtoCheckRules.push(
        new NotSpecifiedDTOAttrsFieldRule(
          Object.keys(
            (this.config.typeConfig as unknown as DTOTypeValidationConfig<ValidatableDTO>)
              .validatorMap,
          ),
        ),
      );
    }

    return dtoCheckRules;
  }
}
