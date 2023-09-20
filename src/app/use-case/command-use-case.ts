import {
  GeneralCommandUcParams, GetUcOptions, GetUcResult,
} from './types';
import { CommandValidatorMap } from '../../domain/validator/field-validator/types';
import { Caller, CallerType } from '../caller';
import { success } from '../../common/result/success';
import { failure } from '../../common/result/failure';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { badRequestInvalidCommandNameError } from './constants';
import { Locale } from '../../domain/locale';
import { QueryUseCase } from './query-use-case';
import { BadRequestError, PermissionDeniedError, ValidationError } from './error-types';
import { DTO } from '../../domain/dto';
import { DtoFieldValidator } from '../../domain/validator/field-validator/dto-field-validator';

export abstract class CommandUseCase<
  UC_PARAMS extends GeneralCommandUcParams,
> extends QueryUseCase<UC_PARAMS> {
  protected abstract supportedCallers: ReadonlyArray<CallerType>;

  protected abstract validatorMap: CommandValidatorMap<UC_PARAMS['inputOptions']['command']>;

  /** проверка доменных разрешений */
  // eslint-disable-next-line max-len
  protected abstract checkPersmissions(options: GetUcOptions<UC_PARAMS>): Promise<GetUcResult<UC_PARAMS>>

  /**
   * Выполнить проверку разрешений, которую можно выполнить до
   * выполнения доменной логики и её проверок.
   * */
  protected async runInitialChecks(
    options: GetUcOptions<UC_PARAMS>,
  ): Promise<GetUcResult<UC_PARAMS>> {
    const checkCallerResult = this.checkCallerPermission(options.caller);
    if (checkCallerResult.isFailure()) return checkCallerResult;

    const validationResult = this.checkValidations(options);
    if (validationResult.isFailure()) return validationResult;

    return this.checkPersmissions(options);
  }

  protected checkCallerPermission(caller: Caller): GetUcResult<UC_PARAMS> {
    if (this.supportedCallers.includes(caller.type)) return success(undefined);

    const err = dodUtility.getDomainErrorByType<PermissionDeniedError<Locale>>(
      'Permission denied',
      'Действие не доступно',
      { allowedOnlyFor: this.supportedCallers },
    );
    return failure(err);
  }

  protected checkValidations(
    input: GetUcOptions<UC_PARAMS>,
  ): Result<ValidationError | BadRequestError<Locale>, undefined> {
    const result = this.validatorMap.validate(input.command.attrs);

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
