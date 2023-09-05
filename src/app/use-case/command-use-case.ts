import { UseCase } from './use-case';
import { GeneralCommandUcParams, GetUcResult, ValidationError } from './types';
import { ValidatorMap } from '../../domain/validator/field-validator/types';
import { Caller } from '../caller';
import { success } from '../../common/result/success';
import { failure } from '../../common/result/failure';
import { Result } from '../../common/result/types';
import { DtoFieldValidator } from '../../domain/validator/field-validator/dto-field-validator';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';

export abstract class CommandUseCase<
  UC_PARAMS extends GeneralCommandUcParams
> extends UseCase<UC_PARAMS> {
  protected abstract supportedCallers: UC_PARAMS['caller'];

  protected abstract validatorMap: ValidatorMap<UC_PARAMS['in']>;

  protected checkCallerPermission(caller: Caller): GetUcResult<UC_PARAMS> {
    if (this.supportedCallers.includes(caller.type)) return success(undefined);

    const err = dodUtility.getDomainError(
      'permission-denied',
      'Действие не доступно',
      { allowedOnlyFor: this.supportedCallers },
    );
    return failure(err);
  }

  protected checkValidations(input: UC_PARAMS['in']): Result<ValidationError, undefined> {
    // @ts-ignore
    const validator = new DtoFieldValidator('dto', true, { isArray: false }, this.validatorMap);
    validator.init(input.name, this.logger);
    const result = validator.validate(input);

    if (result.isFailure()) {
      const err: ValidationError = {
        name: 'validation-error',
        domainType: 'error',
        errorType: 'app-error',
        errors: result.value,
      };
      return failure(err);
    }
    return result;
  }
}
