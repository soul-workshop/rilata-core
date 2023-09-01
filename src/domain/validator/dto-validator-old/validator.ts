/* eslint-disable no-constant-condition */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { failure } from '../../../common/result/failure';
import { success } from '../../../common/result/success';
import { InferFailure, Result } from '../../../common/result/types';
import { Constructor } from '../../../common/types';
import { DODUtility } from '../../../common/utils/domain-object-data/dod-utility';
import { dtoUtility } from '../../../common/utils/dto';
import { GeneralBaseResolver } from '../../../conf/types';
import { wholeValueValidationErrorKey } from '../constants';
import { DTOKeysValidatorMap } from '../field-validator/dto.field-validator';
import { LiteralFieldValidator } from '../field-validator/literal.field-validator';
import {
  FieldValidationErrors,
  ValidatableDTO, ValidatableLiteralType,
  ValidatableLiteralTypeArray, ValidatableType,
  ValidationError,
  ValidationErrorAttrs,
  validationErrorName,
  ValidationResult,
  WholeDTOValidationError,
  WholeLiteralValidationError,
} from '../types';
import { ValidatorMap } from './types';

export const nonValidatableValueRule = 'ValueMustBeOneFromSupportedToValidate';

type LiteralFieldValidReturnType = Result<WholeLiteralValidationError | {
  [key: string]:
    | FieldValidationErrors
    | Record<number, FieldValidationErrors>
}, undefined>;

type DTOFieldValidReturnType = Result<WholeDTOValidationError | {
  [key: string]:
    | FieldValidationErrors
}, undefined>;

export abstract class Validator<VT extends ValidatableType> {
  abstract validatorMap: ValidatorMap<VT>;

  static instance<
    // Должно быть V extends Validator<ValidatableType>, но тогда использование этого метода
    // выдает ошибки. TODO: исправить.
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-explicit-any
    V extends any
  >(
    this: Constructor<V>,
    resolver: GeneralBaseResolver,
  ): V {
    return resolver.getValidator(this as Constructor<Validator<ValidatableType>>, []) as V;
  }

  validate(value: VT): ValidationResult<VT> {
    let validationErrorsAccumulator: InferFailure<
    LiteralFieldValidReturnType> | InferFailure<DTOFieldValidReturnType> = {};

    if (this.isLiteral(value)) {
      const literalValidResult = this.validateLiteral(
        value as ValidatableLiteralType | ValidatableLiteralTypeArray,
        this.validatorMap as ValidatorMap<ValidatableLiteralType | ValidatableLiteralTypeArray>,
        wholeValueValidationErrorKey,
      );
      if (literalValidResult.isFailure()) {
        validationErrorsAccumulator = literalValidResult.value;
      }
    } else if (this.isDTO(value)) {
      const dtoValidResult = this.validateDTO(
        value as ValidatableDTO | ValidatableDTO[],
        this.validatorMap as ValidatorMap<ValidatableDTO | ValidatableDTO[]>,
        wholeValueValidationErrorKey,
      );
      if (dtoValidResult.isFailure()) {
        validationErrorsAccumulator = dtoValidResult.value;
      }
    } else {
      validationErrorsAccumulator = {
        [wholeValueValidationErrorKey]: [
          {
            validationErrorName: nonValidatableValueRule,
            validationErrorHint: [],
          },
        ],
      };
    }

    if (Object.keys(validationErrorsAccumulator).length > 0) {
      return failure(
        DODUtility.getDomainError<ValidationError<VT>>(
          validationErrorName,
          validationErrorsAccumulator as ValidationErrorAttrs<VT, true>,
        ),
      );
    }

    return success(undefined);
  }

  private isLiteral(value: unknown): value is ValidatableLiteralType | ValidatableLiteralTypeArray {
    if (Array.isArray(value)) {
      if (value.every((elem) => typeof elem === 'string' || typeof elem === 'number' || typeof elem === 'boolean')) {
        return true;
      }
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return true;
    }

    return false;
  }

  private isDTO(value: unknown): value is ValidatableDTO | ValidatableDTO[] {
    if (Array.isArray(value)) {
      if (value.every((elem) => dtoUtility.isDTO(elem))) {
        return true;
      }
    }
    if (dtoUtility.isDTO(value)) {
      return true;
    }

    return false;
  }

  private validateLiteral<LVT extends ValidatableLiteralType | ValidatableLiteralTypeArray>(
    value: LVT,
    currentValidatorMap: ValidatorMap<LVT>,
    currentKey: string,
  ): LiteralFieldValidReturnType {
    const fieldValidationResult = currentValidatorMap.validate(value);
    if (fieldValidationResult.isFailure()) {
      const areErrorsOfLiteralValue = Array.isArray(fieldValidationResult.value);
      if (areErrorsOfLiteralValue) {
        const errors = fieldValidationResult.value as FieldValidationErrors;
        return failure({ [currentKey]: errors });
      }

      const errorsOfElementsInArrayOfLiterals = fieldValidationResult
        .value as Record<number, FieldValidationErrors>;
      return failure(currentKey === wholeValueValidationErrorKey
        ? errorsOfElementsInArrayOfLiterals
        : { [currentKey]: errorsOfElementsInArrayOfLiterals });
    }

    return success(undefined);
  }

  private validateDTO<DTOVT extends ValidatableDTO | ValidatableDTO[]>(
    value: DTOVT,
    currentValidatorMap: ValidatorMap<DTOVT>,
    currentKey: string,
  ): DTOFieldValidReturnType {
    const fieldValidationResult = currentValidatorMap.validate(value);
    if (fieldValidationResult.isFailure()) {
      const errors = fieldValidationResult.value as FieldValidationErrors;
      return failure({ [currentKey]: errors });
    }

    const shouldNotCheckFieldsOfCurrentDTO = value === undefined;
    if (shouldNotCheckFieldsOfCurrentDTO) {
      return success(undefined);
    }

    const accumulationObjectOfErrosOfCurrentDTOFields: InferFailure<
      LiteralFieldValidReturnType>
      | InferFailure<DTOFieldValidReturnType> = {};

    if (Array.isArray(value)) {
      value.forEach((dto, idx) => {
        const iterator = this.validateDTOFields(
          dto,
          currentValidatorMap.config.typeConfig.validatorMap,
        );
        while (true) {
          const iteratorStep = iterator.next();
          if (iteratorStep.done) break;
          if (iteratorStep.value.isFailure()) {
            if (!(idx in accumulationObjectOfErrosOfCurrentDTOFields)) {
              (accumulationObjectOfErrosOfCurrentDTOFields as Record<number, object>)[idx] = {};
            }
            Object.assign(
              (accumulationObjectOfErrosOfCurrentDTOFields as Record<number, object>)[idx],
              iteratorStep.value.value,
            );
          }
        }
      });
    } else {
      const iterator = this.validateDTOFields(
        value,
        currentValidatorMap.config.typeConfig.validatorMap,
      );
      while (true) {
        const iteratorStep = iterator.next();
        if (iteratorStep.done) break;
        if (iteratorStep.value.isFailure()) {
          Object.assign(
            accumulationObjectOfErrosOfCurrentDTOFields,
            iteratorStep.value.value,
          );
        }
      }
    }

    const wereDTOErrors = Object.keys(accumulationObjectOfErrosOfCurrentDTOFields).length > 0;
    if (!wereDTOErrors) {
      return success(undefined);
    }

    const isWholeValueError = currentKey === wholeValueValidationErrorKey;
    return failure(
      isWholeValueError
        ? accumulationObjectOfErrosOfCurrentDTOFields
        : {
          [currentKey]: accumulationObjectOfErrosOfCurrentDTOFields,
        },
    ) as unknown as DTOFieldValidReturnType;
  }

  private* validateDTOFields<T extends ValidatableDTO>(
    dtoFieldValue: T,
    dtoFieldValidatorMap: DTOKeysValidatorMap<T>,
  ): Generator<LiteralFieldValidReturnType | DTOFieldValidReturnType> {
    for (
      const [key, vMap] of Object.entries(dtoFieldValidatorMap)
    ) {
      let fieldValidResult: LiteralFieldValidReturnType
          | DTOFieldValidReturnType;

      if (vMap instanceof LiteralFieldValidator) {
        fieldValidResult = this.validateLiteral(
          (
            dtoFieldValue as ValidatableDTO
          )[key] as ValidatableLiteralType | ValidatableLiteralTypeArray,
          vMap as unknown as ValidatorMap<
            ValidatableLiteralType | ValidatableLiteralTypeArray>,
          key,
        );
      } else {
        fieldValidResult = this.validateDTO(
          (dtoFieldValue as ValidatableDTO)[key] as ValidatableDTO | ValidatableDTO[],
          vMap as unknown as ValidatorMap<ValidatableDTO | ValidatableDTO[]>,
          key,
        );
      }

      yield fieldValidResult;
    }
  }
}
