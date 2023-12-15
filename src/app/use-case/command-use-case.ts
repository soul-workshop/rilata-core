import {
  GeneralCommandUcParams, GetUcOptions,
} from './types';
import { CommandValidatorMap } from '../../domain/validator/field-validator/types';
import { failure } from '../../common/result/failure';
import { Result } from '../../common/result/types';
import { Locale } from '../../domain/locale';
import { QueryUseCase } from './query-use-case';
import { PermissionDeniedError, ValidationError } from './error-types';

export abstract class CommandUseCase<
  UC_PARAMS extends GeneralCommandUcParams,
> extends QueryUseCase<UC_PARAMS> {
  protected abstract validatorMap: CommandValidatorMap<UC_PARAMS['inputOptions']['command']>;

  /**
   * Выполнить проверку разрешений, которую можно выполнить до
   * выполнения доменной логики и её проверок.
   * */
  protected async runInitialChecks(
    options: GetUcOptions<UC_PARAMS>,
  ): Promise<Result<ValidationError | PermissionDeniedError<Locale>, undefined>> {
    const checkCallerResult = this.checkCallerPermission(options.caller);
    if (checkCallerResult.isFailure()) return checkCallerResult;

    return this.checkValidations(options);
  }

  protected checkValidations(
    input: GetUcOptions<UC_PARAMS>,
  ): Result<ValidationError, undefined> {
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
