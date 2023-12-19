/* eslint-disable @typescript-eslint/no-unused-vars */
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';
import { Caller, CallerType } from '../caller';
import {
  GeneralQueryUcParams, GetUcOptions, GetUcResult,
  GetActionDodBody, ActionDodValidator, GetActionDodName,
} from './types';
import { UseCase } from './use-case';
import { InternalError, PermissionDeniedError, ValidationError } from './error-types';

export abstract class QueryUseCase<UC_PARAMS extends GeneralQueryUcParams>
  extends UseCase {
  protected abstract name: GetActionDodName<UC_PARAMS>;

  protected abstract aRootName: UC_PARAMS['aRootName'];

  protected abstract supportedCallers: ReadonlyArray<CallerType>;

  /** выполнение доменной логики */
  protected abstract runDomain(options: GetUcOptions<UC_PARAMS>): Promise<GetUcResult<UC_PARAMS>>

  protected abstract validatorMap: ActionDodValidator<UC_PARAMS>;

  async execute(options: GetUcOptions<UC_PARAMS>): Promise<GetUcResult<UC_PARAMS>> {
    try {
      const checksResult = await this.runInitialChecks(options);
      if (checksResult.isFailure()) return checksResult;
      return this.runDomain(options);
    } catch (e) {
      if (process.env.TEST_ENV === 'test') {
        throw e;
      }
      this.logger.fatalError('server internal error', options);
      const err = dodUtility.getAppErrorByType<InternalError<Locale>>(
        'Internal error',
        'Извините, на сервере произошла ошибка',
        {},
      );
      return failure(err);
    }
  }

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

  // eslint-disable-next-line max-len
  protected checkCallerPermission(caller: Caller): Result<PermissionDeniedError<Locale>, undefined> {
    if (this.supportedCallers.includes(caller.type)) return success(undefined);

    const err = dodUtility.getDomainErrorByType<PermissionDeniedError<Locale>>(
      'Permission denied',
      'Действие не доступно',
      { allowedOnlyFor: this.supportedCallers },
    );
    return failure(err);
  }

  protected checkValidations(
    actionDod: GetActionDodBody<UC_PARAMS>,
  ): Result<ValidationError, undefined> {
    const result = this.validatorMap.validate(actionDod);

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
