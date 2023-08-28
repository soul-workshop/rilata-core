/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { BaseFieldValidationRule } from '../field-rules/base.field-v-rule';
import {
  FieldValidationErrors,
  ValidatableType,
} from '../types';
import {
  BaseFieldValidator, BaseFieldValidionConfig,
  BaseTypeValidationConfig, FieldInternalValidationResult,
} from './base.field-validator';
import { ArrayValidationConfig, FieldValidationResult, ValidatableTypes } from './types';
import { failure } from '../../../common/result/failure';
import { success } from '../../../common/result/success';
import { InferFailure } from '../../../common/result/types';

export type LiteralTypeValidationConfig = BaseTypeValidationConfig<
Extract<ValidatableTypes, 'string' | 'number' | 'boolean'>>;

export type LiteralFieldValidationConfig<
  R extends boolean,
  AC extends ArrayValidationConfig<boolean>,
  TC extends LiteralTypeValidationConfig,
> = BaseFieldValidionConfig<R, AC, TC> & { rules: BaseFieldValidationRule[] };

export class LiteralFieldValidator<
  R extends boolean,
  AC extends ArrayValidationConfig<boolean>,
  TC extends LiteralTypeValidationConfig,
> extends BaseFieldValidator<R, AC, TC> {
  protected clientRules: BaseFieldValidationRule[];

  constructor(config: LiteralFieldValidationConfig<R, AC, TC>) {
    super(config);
    this.clientRules = config.rules;
  }

  protected validateInternal<V extends ValidatableType>(value: V): FieldInternalValidationResult {
    const parentValidResult = super.validateInternal(value);

    if (parentValidResult.value.break) {
      return parentValidResult;
    }

    if (this.clientRules.length > 0) {
      if (Array.isArray(value)) {
        let breakV = false;
        const errContainer = {} as InferFailure<FieldValidationResult>;
        value.forEach((elem, idx) => {
          const res = this.validateRules(elem, this.clientRules);
          breakV = res.value.break;
          if (res.isFailure()) {
            errContainer[idx] = res.value.errors;
          }
        });

        if (parentValidResult.isFailure() && Object.keys(errContainer).length > 0) {
          return failure(
            {
              errors: this.combineParentAndCurrentArrayValueErrors(
                parentValidResult.value as Record<number, FieldValidationErrors>,
                errContainer as Record<number, FieldValidationErrors>,
              ),
              break: breakV,
            },
          );
        }
        if (parentValidResult.isFailure()) {
          return parentValidResult;
        }
        if (Object.keys(errContainer).length > 0) {
          return failure({
            errors: errContainer,
            break: breakV,
          });
        }
        return success({ break: breakV });
      }

      const res = this.validateRules(value, this.clientRules);
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

    return parentValidResult;
  }

  private combineParentAndCurrentArrayValueErrors(
    firstErrors: Record<number, FieldValidationErrors>,
    secondErrors: Record<number, FieldValidationErrors>,
  ): Record<number, FieldValidationErrors> {
    const result = {} as Record<number, FieldValidationErrors>;
    Object.entries(firstErrors).forEach(([key, value]) => {
      result[+key] = value;
    });

    Object.entries(secondErrors).forEach(([key, value]) => {
      if (+key in result) {
        result[+key] = [...result[+key], ...value];
      } else {
        result[+key] = value;
      }
    });

    return result;
  }
}
