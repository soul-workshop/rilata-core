import { Result } from '../../../common/result/types';
import {
  FieldValidationErrors, ValidatableDTO,
} from '../types';
import { BaseFieldValidator } from './base.field-validator';
import { DTOFieldValidator } from './dto.field-validator';
import { LiteralFieldValidator } from './literal.field-validator';

export type FieldValidationResult = Result<
  Record<number, FieldValidationErrors> | FieldValidationErrors,
  true
>;

export type ValidatableTypes = 'string' | 'number' | 'boolean' | 'dto';

export type IsArrayConfig<B extends boolean> = B extends false
  ? {
    isArray: false,
  }
  : {
    isArray: true,
    maxElementsCount?: number,
  };

export type GeneralBaseFieldValidator = BaseFieldValidator<
  boolean,
  boolean
>;

export type GeneralLiteralFieldValidator = LiteralFieldValidator<
  boolean,
  boolean
>;

export type GeneralDTOFieldValidator = DTOFieldValidator<
  boolean,
  boolean,
  ValidatableDTO
>;
