/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { failure } from '../../../common/result/failure';
import { success } from '../../../common/result/success';
import { Result } from '../../../common/result/types';
import { AssertionException } from '../../../common/types';
import { BaseFieldValidationRule } from '../field-rules/base.field-v-rule';
import { CanBeEmptyFieldRule } from '../field-rules/default/can-be-empty.field-v-rule';
import { IsArrayFieldRule } from '../field-rules/default/is-array.field-v-rule';
import { IsRequiredFieldRule } from '../field-rules/default/is-required.field-v-rule';
import { MaxArrayElementsCountFieldRule } from '../field-rules/default/max-array-elements-count.field-v-rule';
import { NotNullFieldRule } from '../field-rules/default/not-null.field-v-rule';
import { IsBooleanArrayFieldRule } from '../field-rules/default/type/is-boolean-array.field-v-rule';
import { IsBooleanFieldRule } from '../field-rules/default/type/is-boolean.field-v-rule';
import { IsDTOArrayFieldRule } from '../field-rules/default/type/is-dto-array.field-v-rule';
import { IsDTOFieldRule } from '../field-rules/default/type/is-dto.field-v-rule';
import { IsNumberArrayFieldRule } from '../field-rules/default/type/is-number-array.field-v-rule';
import { IsNumberFieldRule } from '../field-rules/default/type/is-number.field-v-rule';
import { IsStringArrayFieldRule } from '../field-rules/default/type/is-string-array.field-v-rule';
import { IsStringFieldRule } from '../field-rules/default/type/is-string.field-v-rule';
import { FieldValidationErrors } from '../types';
import { FieldValidationResult, ValidatableTypes, IsArrayConfig } from './types';

export type FieldInternalValidationResult = Result<
  {
    break: boolean,
    errors: Record<number, FieldValidationErrors> | FieldValidationErrors,
  },
  { break : boolean }
>;

export abstract class BaseFieldValidator<
  REQ extends boolean,
  ARR extends boolean,
> {
  protected abstract type: ValidatableTypes;

  constructor(
    protected isRequired: REQ,
    protected isArrayConfig: IsArrayConfig<ARR>,
  ) {}

  validate(value: unknown): FieldValidationResult {
    const res = this.validateInternal(value);
    return res.isFailure()
      ? failure(res.value.errors)
      : success(true);
  }

  protected validateInternal(value: unknown): FieldInternalValidationResult {
    const errors: FieldValidationErrors = [];

    const firstCheckResult = this.validateRules(value, this.getFirstCheckRules());
    if (firstCheckResult.isFailure()) {
      errors.push(...firstCheckResult.value.errors);
      if (firstCheckResult.value.break) {
        return failure({ break: true, errors });
      }
    } else if (firstCheckResult.value.break) {
      return errors.length > 0 ? failure({ break: true, errors }) : success({ break: true });
    }

    if (this.isArrayConfig.isArray) {
      const arrayCheckResult = this.validateRules(value, this.getArrayCheckRules());
      if (arrayCheckResult.isFailure()) {
        errors.push(...arrayCheckResult.value.errors);
        if (arrayCheckResult.value.break) {
          return failure({ break: true, errors });
        }
      } else if (arrayCheckResult.value.break) {
        return errors.length > 0 ? failure({ break: true, errors }) : success({ break: true });
      }
    }

    const typeCheckResult = this.validateRules(value, this.getTypeCheckRules());
    if (typeCheckResult.isFailure()) {
      errors.push(...typeCheckResult.value.errors);
      if (typeCheckResult.value.break) {
        return failure({ break: true, errors });
      }
    } else if (typeCheckResult.value.break) {
      return errors.length > 0 ? failure({ break: true, errors }) : success({ break: true });
    }

    return errors.length > 0 ? failure({ break: true, errors }) : success({ break: false });
  }

  protected validateRules(value: unknown, rules: BaseFieldValidationRule[]): Result<
    {errors: FieldValidationErrors, break: boolean}, { break: boolean }
  > {
    const errors: FieldValidationErrors = [];
    let shouldBreak = false;

    for (const rule of rules) {
      const ruleValidationResult = rule.validate(value);

      if (ruleValidationResult.behaviour === 'RunNextRule') {
        continue;
      } else if (
        ruleValidationResult.behaviour === 'BreakFieldValidation'
      ) {
        shouldBreak = true;
        break;
      } else if (
        ruleValidationResult.behaviour === 'SaveErrorAndRunNextRule'
      ) {
        errors.push(ruleValidationResult.fieldValidationError);
        continue;
      } else if (
        ruleValidationResult.behaviour === 'SaveErrorAndBreakFieldValidation'
      ) {
        errors.push(ruleValidationResult.fieldValidationError);
        shouldBreak = true;
        break;
      } else {
        throw new AssertionException('Неизвестный FieldValidationRuleResultBehaviour.');
      }
    }

    return errors.length > 0
      ? failure({ errors, break: shouldBreak })
      : success({ break: shouldBreak });
  }

  protected getFirstCheckRules(): BaseFieldValidationRule[] {
    const firstCheckRules: BaseFieldValidationRule[] = [];

    firstCheckRules.push(new NotNullFieldRule());

    if (this.isRequired) {
      firstCheckRules.push(new IsRequiredFieldRule());
    } else {
      firstCheckRules.push(new CanBeEmptyFieldRule());
    }
    return firstCheckRules;
  }

  protected getArrayCheckRules(): BaseFieldValidationRule[] {
    const arrayCheckRules: BaseFieldValidationRule[] = [];

    if (this.isArrayConfig.isArray) { // просто для защиты типа для maxElementsCount
      arrayCheckRules.push(new IsArrayFieldRule());
      if (this.isArrayConfig.maxElementsCount) {
        arrayCheckRules.push(
          new MaxArrayElementsCountFieldRule(this.isArrayConfig.maxElementsCount),
        );
      }
    }

    return arrayCheckRules;
  }

  protected getTypeCheckRules(): BaseFieldValidationRule[] {
    const { isArray } = this.isArrayConfig;
    switch (this.type) {
      case 'boolean':
        return isArray ? [new IsBooleanArrayFieldRule()] : [new IsBooleanFieldRule()];
      case 'string':
        return isArray ? [new IsStringArrayFieldRule()] : [new IsStringFieldRule()];
      case 'number':
        return isArray ? [new IsNumberArrayFieldRule()] : [new IsNumberFieldRule()];
      case 'dto':
        return isArray ? [new IsDTOArrayFieldRule()] : [new IsDTOFieldRule()];
      default:
        throw new AssertionException(`Определен неверный тип валидатора ${this.type}`);
    }
  }
}
