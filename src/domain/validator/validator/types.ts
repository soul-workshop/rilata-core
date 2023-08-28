/* eslint-disable no-use-before-define */
import { DTOFieldValidator } from '../field-validator/dto.field-validator';
import { LiteralFieldValidator } from '../field-validator/literal.field-validator';
import { ArrayValidationConfig } from '../field-validator/types';
import {
  ValidatableDTO, ValidatableLiteralType,
  ValidatableLiteralTypeArray, ValidatableType,
} from '../types';

export type ValidatorMap<
  VT extends ValidatableType,
  ISREQ extends boolean = true
> = VT extends ValidatableLiteralTypeArray | ValidatableDTO[]
  ? ArrayValidatorMap<VT, ISREQ>
  : VT extends ValidatableLiteralType
    ? LiteralTypeValidatorMap<VT, ISREQ, false>
    : VT extends ValidatableDTO
      ? DTOValidatorMap<VT, ISREQ, false>
      : never

type ArrayValidatorMap<
  VT extends ValidatableLiteralTypeArray | ValidatableDTO[],
  ISREQ extends boolean
> = [VT[number]] extends [ValidatableLiteralType]
  ? LiteralTypeValidatorMap<VT[number], ISREQ, true>
  : VT[number] extends ValidatableDTO
    ? DTOValidatorMap<VT[number], ISREQ, true>
    : never;

type DTOValidatorMap<
  VT extends ValidatableDTO,
  ISREQ extends boolean,
  ISARR extends boolean,
> = DTOFieldValidator<ISREQ, ArrayValidationConfig<ISARR>, VT>;

export type LiteralTypeValidatorMap<
  VT extends ValidatableLiteralType,
  ISREQ extends boolean,
  ISARR extends boolean,
> = LiteralFieldValidator<
  ISREQ,
   ArrayValidationConfig<ISARR>,
   {
    type: VT extends string
      ? 'string'
      : VT extends boolean
        ? 'boolean'
        : VT extends number
          ? 'number'
          : never
   }
>;
