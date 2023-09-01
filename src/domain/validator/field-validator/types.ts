/* eslint-disable no-use-before-define */
import { Result } from '../../../common/result/types';
import { DTO } from '../../dto';
import { LiteralDataType, RuleError } from '../../validator/rules/types';
import { DtoFieldValidator } from './dto-field-validator';
import { LiteralFieldValidator } from './literal-field-validator';

export type GetFieldValidatorDataType<DATA_TYPE extends LiteralDataType | DTO> =
  DATA_TYPE extends DTO
    ? 'dto'
    : DATA_TYPE extends string
      ? 'string'
      : DATA_TYPE extends number
        ? 'number'
        : 'boolean'

export type GetArrayConfig<B extends boolean> = B extends false
  ? {
    isArray: false,
  }
  : {
    isArray: true,
    maxElementsCount?: number,
    minElementsCount?: number,
    mustBeFilled?: boolean, // true -> должна быть хотя бы одна ячейка
  };

export type LiteralFieldErrors = RuleError[];

type ArrayItemIndex = number;

export type FieldErrors = LiteralFieldErrors | DtoFieldErrors;

export type ArrayFieldErrors = Record<ArrayItemIndex, FieldErrors>;

type AttrName = string;

export type DtoFieldErrors = { [s: AttrName]: FieldErrors | ArrayFieldErrors };

export type FieldValidatorResult = Result<DtoFieldErrors, true>;

export type RulesValidatedAnswer<ARR extends boolean = false> = {
    isValidValue: false,
    break: boolean,
    errors: ARR extends true ? ArrayFieldErrors : LiteralFieldErrors,
  } | {
    isValidValue: true,
    break: boolean,
    errors?: never, // чтобы было проще тестировать
  };

export type GeneralLiteralFieldValidator = LiteralFieldValidator<
  boolean,
  boolean,
  LiteralDataType
>;

type GetValidator<REQ extends boolean, IS_ARR extends boolean, TYPE> =
  TYPE extends DTO
    ? DtoFieldValidator<REQ, IS_ARR, TYPE>
    : TYPE extends LiteralDataType
      ? LiteralFieldValidator<REQ, IS_ARR, TYPE>
      : never

export type ValidatorMap<DTO_TYPE extends DTO> = {
  [KEY in keyof DTO_TYPE]-?: undefined extends DTO_TYPE[KEY]
    ? DTO_TYPE[KEY] extends Array<infer ARR_TYPE>
      ? GetValidator<false, true, ARR_TYPE>
      : GetValidator<false, false, DTO_TYPE[KEY]>
    : DTO_TYPE[KEY] extends Array<infer ARR_TYPE>
      ? GetValidator<true, true, ARR_TYPE>
      : GetValidator<true, false, DTO_TYPE[KEY]>
}

type PhoneAttrs = {
  number: string,
  code: string,
}

const phoneAttrsValidatorMap: ValidatorMap<PhoneAttrs> = {
  number: new LiteralFieldValidator('string', true, { isArray: false }, []),
  code: new LiteralFieldValidator('string', true, { isArray: false }, []),
};

type EmailAttrs = {
  value: string,
  type: string, // TODO: 'corporate' | 'private' вызывает ошибку типа
}

const emailAttrsValidatorMap: ValidatorMap<EmailAttrs> = {
  type: new LiteralFieldValidator('string', true, { isArray: false }, []),
  value: new LiteralFieldValidator('string', true, { isArray: false }, []),
};

type PersonAttrs = {
  firstName: string,
  lastName?: string,
  phones: PhoneAttrs[],
  email?: EmailAttrs,
}

const personAttrsValidatrorMap: ValidatorMap<PersonAttrs> = {
  firstName: new LiteralFieldValidator('string', true, { isArray: false }, []),
  lastName: new LiteralFieldValidator('string', false, { isArray: false }, []),
  phones: new DtoFieldValidator(
    phoneAttrsValidatorMap,
    true,
    { isArray: true, minElementsCount: 1 },
  ),
  email: new DtoFieldValidator(
    emailAttrsValidatorMap,
    false,
    { isArray: false },
  ),
};

export const personAttrsValidator = new DtoFieldValidator(
  personAttrsValidatrorMap,
  true,
  { isArray: false },
);
