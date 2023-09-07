/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '../../common/logger/logger';
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { GeneralARDParams } from '../../domain/domain-object-data/aggregate-data-types';
import { GetARParamsActionNames, GetARParamsAggregateName, GetARParmasActionType } from '../../domain/domain-object-data/type-functions';
import { Caller } from '../caller';
import { GeneralInstanceActionable } from './actionable/types';
import {
  GeneralUcParams, GetUcOptions, GetUcResult, ValidationError,
} from './types';
import { Actionable } from './actionable/actionable';

export abstract class UseCase<AR_PARAMS extends GeneralARDParams, UC_PARAMS extends GeneralUcParams>
implements Actionable< AR_PARAMS, GetARParamsActionNames<AR_PARAMS> > {
  abstract actionType: GetARParmasActionType<AR_PARAMS>;

  abstract aggregateName: GetARParamsAggregateName<AR_PARAMS>;

  abstract actionName: GetARParamsActionNames<AR_PARAMS>;

  abstract getAction(
    userId: string,
    ...args: unknown[]
  ): Promise<Record<GetARParamsActionNames<AR_PARAMS>, boolean>>;

  /** выполнение доменной логики */
  protected abstract runDomain(options: GetUcOptions<UC_PARAMS>): Promise<GetUcResult<UC_PARAMS>>

  protected logger!: Logger;

  init(logger: Logger): void {
    this.logger = logger;
  }

  async execute(options: GetUcOptions<UC_PARAMS>): Promise<GetUcResult<UC_PARAMS>> {
    try {
      const checksResult = await this.runInitialChecks(options);
      if (checksResult.isFailure()) {
        return checksResult;
      }
      return this.runDomain(options);
    } catch (e) {
      if (process.env.TEST_ENV === 'test') {
        throw e;
      }
      this.logger.fatalError('server internal error', options);
      const err = dodUtility.getAppError('InternalError', 'Извините, на сервере произошла ошибка');
      return failure(err);
    }
  }

  isInstanceActionable(): this is GeneralInstanceActionable {
    return this.actionType === 'instance';
  }

  isClassActionable(): this is GeneralInstanceActionable {
    return this.actionType === 'class';
  }

  /**
   * Выполнить проверку разрешений, которую можно выполнить до
   * выполнения доменной логики и её проверок.
   * */
  protected async runInitialChecks(
    options: GetUcOptions<UC_PARAMS>,
  ): Promise<GetUcResult<UC_PARAMS>> {
    const checkCallerResult = this.checkCallerPermission(options.caller);
    if (checkCallerResult.isFailure()) return checkCallerResult;

    const validationResult = this.checkValidations(options.in);
    if (validationResult.isFailure()) return validationResult;

    return this.checkPersmissions(options);
  }

  /** проверка типа пользователя */
  protected checkCallerPermission(_caller: Caller): GetUcResult<UC_PARAMS> {
    return success(undefined);
  }

  /** проверка доменных разрешений */
  protected async checkPersmissions(
    _options: GetUcOptions<UC_PARAMS>,
  ): Promise<GetUcResult<UC_PARAMS>> {
    return success(undefined);
  }

  /** првоерка валидации входных данных */
  protected checkValidations(_input: UC_PARAMS['input'], ..._args: unknown[]): Result<ValidationError, undefined> {
    return success(undefined);
  }
}
