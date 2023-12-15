/* eslint-disable @typescript-eslint/no-unused-vars */
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';
import { Caller, CallerType } from '../caller';
import {
  GeneralQueryUcParams, GetUcOptions, GetUcParamsARParams, GetUcResult,
} from './types';
import { UseCase } from './use-case';
import { InternalError, PermissionDeniedError } from './error-types';

export abstract class QueryUseCase<UC_PARAMS extends GeneralQueryUcParams>
  extends UseCase<GetUcParamsARParams<UC_PARAMS>> {
  protected abstract supportedCallers: ReadonlyArray<CallerType>;

  /** выполнение доменной логики */
  protected abstract runDomain(options: GetUcOptions<UC_PARAMS>): Promise<GetUcResult<UC_PARAMS>>

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
   * Выполнить проверку какие либо проверки до выполнения доменной логики.
   * */
  protected async runInitialChecks(..._args: unknown[]): Promise<Result<unknown, unknown>> {
    return success(undefined);
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
}
