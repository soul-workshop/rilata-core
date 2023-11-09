/* eslint-disable @typescript-eslint/no-unused-vars */
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';
import { InternalError } from './error-types';
import { GeneralQueryUcParams, GetUcOptions, GetUcResult } from './types';
import { UseCase } from './use-case';

export abstract class QueryUseCase<UC_PARAMS extends GeneralQueryUcParams> extends UseCase {
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
}
