/* eslint-disable no-use-before-define */

import { Result } from '../../common/result/types';
import { DomainErrorDOD } from '../domain-object-data/domain-objects';
import { wholeValueValidationErrorKey } from './constants';

type ValidatableDTOKeyValue = string | number | boolean | undefined | ValidatableDTO
| string[] | number[] | boolean[] | ValidatableDTO[];

export type ValidatableDTO = { [key: string]: ValidatableDTOKeyValue };

export type ValidatableLiteralType = string | number | boolean;

export type ValidatableLiteralTypeArray = string[] | number[] | boolean[];

export type ValidatableType = ValidatableLiteralType | ValidatableLiteralTypeArray | ValidatableDTO
  | ValidatableDTO[];

export type FieldValidationError = {
  validationErrorName: string,
  validationErrorHint: Array<Record<string, ValidatableLiteralType | ValidatableLiteralTypeArray>>,
}

export type FieldValidationErrors = Array<FieldValidationError>;

export type ValidationErrorAttrs<
  VT extends ValidatableType,
  VALIDATION_BEGINNING extends boolean = true
> = VT extends ValidatableLiteralTypeArray | ValidatableDTO[]
  ? ArrayValidationError<VT, VALIDATION_BEGINNING>
  : VT extends ValidatableLiteralType
    ? VALIDATION_BEGINNING extends true
      ? WholeLiteralValidationError
      : LiteralTypeValidationError
    : VT extends ValidatableDTO
      ? DTOValidationError<VT, VALIDATION_BEGINNING>
      : never;

type ArrayValidationError<
  VT extends ValidatableLiteralTypeArray | ValidatableDTO[],
  VALIDATION_BEGINNING extends boolean = false
> = VALIDATION_BEGINNING extends true
  ? {
    [IDX in keyof VT as IDX extends number ? IDX : never]: VT[IDX] extends ValidatableLiteralType
      ? LiteralTypeValidationError
      : VT[IDX] extends ValidatableDTO
        ? DTOValidationError<VT[IDX]>
        : never;
  } & WholeValueValidationError
  : {
    [IDX in keyof VT as IDX extends number ? IDX : never]: VT[IDX] extends ValidatableLiteralType
      ? LiteralTypeValidationError
      : VT[IDX] extends ValidatableDTO
        ? DTOValidationError<VT[IDX]>
        : never;
  } & FieldValidationErrors;

type LiteralTypeValidationError = FieldValidationErrors;

export type WholeValueValidationError = Partial<{
  [wholeValueValidationErrorKey]: FieldValidationErrors
}>;

export type WholeLiteralValidationError = WholeValueValidationError

export type WholeDTOValidationError = WholeValueValidationError;

type DTOValidationError<
  D extends ValidatableDTO,
  VALIDATION_BEGINNING extends boolean = false
> = VALIDATION_BEGINNING extends true
  ? {
    [KEY in keyof D]?: ValidationErrorAttrs<NonNullable<D[KEY]>, false>
  } & WholeDTOValidationError
  : {
    [KEY in keyof D]?: ValidationErrorAttrs<NonNullable<D[KEY]>, false>
  };

export const validationErrorName = 'ValidationError';

export type ValidationError<VT extends ValidatableType> = DomainErrorDOD<
  ValidationErrorAttrs<VT>,
  typeof validationErrorName
>;

export type GeneralValidationError = ValidationError<ValidatableType>;

export type ValidationResult<VT extends ValidatableType> = Result<
  ValidationError<VT>, undefined>;

export type GeneralValidationResult = ValidationResult<ValidatableType>;
