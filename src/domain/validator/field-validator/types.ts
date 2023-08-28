import { Result } from '../../../common/result/types';
import {
  FieldValidationErrors, ValidatableDTO,
} from '../types';
import { BaseFieldValidator, BaseTypeValidationConfig } from './base.field-validator';
import { DTOFieldValidator } from './dto.field-validator';
import { LiteralFieldValidationConfig, LiteralFieldValidator, LiteralTypeValidationConfig } from './literal.field-validator';

export type FieldValidationResult = Result<
  Record<number, FieldValidationErrors> | FieldValidationErrors,
  true
>;

export type ValidatableTypes = 'string' | 'number' | 'boolean' | 'dto';

export type ArrayValidationConfig<ISARR extends boolean> = ISARR extends false
  ? {
    isArray: false,
  }
  : {
    isArray: true,
    maxElementsCount?: number,
  };

export type GeneralBaseFieldValidator = BaseFieldValidator<
  boolean,
  ArrayValidationConfig<boolean>,
  BaseTypeValidationConfig<ValidatableTypes>
>;

export type GeneralLiteralFieldValidator = LiteralFieldValidator<
  boolean,
  ArrayValidationConfig<boolean>,
  LiteralTypeValidationConfig
>;

export type GeneralDTOFieldValidator = DTOFieldValidator<
  boolean,
  ArrayValidationConfig<boolean>,
  ValidatableDTO
>;

export type GeneralLiteralFieldValidationConfig = LiteralFieldValidationConfig<
  boolean,
  ArrayValidationConfig<boolean>,
  LiteralTypeValidationConfig
>;
