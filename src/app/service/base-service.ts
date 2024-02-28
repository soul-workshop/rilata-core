/* eslint-disable @typescript-eslint/no-unused-vars */
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';
import { CallerType } from '../caller';
import {
  ServiceResult, RequestDodValidator,
  GetServiceName, GeneralBaseServiceParams,
} from './types';
import { Service } from './service';
import { PermissionDeniedError, ValidationError } from './error-types';
import { storeDispatcher } from '../async-store/store-dispatcher';

export abstract class BaseService<S_PARAMS extends GeneralBaseServiceParams>
  extends Service {
  abstract override serviceName: GetServiceName<S_PARAMS>;

  protected abstract aRootName: S_PARAMS['aRootName'];

  protected abstract supportedCallers: ReadonlyArray<CallerType>;

  protected abstract validator: RequestDodValidator<S_PARAMS>;

  /** выполнение доменной логики */
  protected abstract runDomain(input: S_PARAMS['input']): Promise<ServiceResult<S_PARAMS>>

  async execute(input: S_PARAMS['input']): Promise<ServiceResult<S_PARAMS>> {
    const checksResult = await this.runInitialChecks(input);
    if (checksResult.isFailure()) return checksResult;
    return this.runDomain(input);
  }

  /**
   * Выполнить проверку разрешений, которую можно выполнить до
   * выполнения доменной логики и её проверок.
   * */
  protected async runInitialChecks(
    input: S_PARAMS['input'],
  ): Promise<Result<ValidationError | PermissionDeniedError<Locale<'Permission denied'>>, undefined>> {
    const checkCallerResult = this.checkCallerPermission();
    if (checkCallerResult.isFailure()) return checkCallerResult;
    return this.checkValidations(input);
  }

  // eslint-disable-next-line max-len
  protected checkCallerPermission(): Result<PermissionDeniedError<Locale<'Permission denied'>>, undefined> {
    const { caller } = storeDispatcher.getStoreOrExepction();
    if (this.supportedCallers.includes(caller.type)) return success(undefined);

    const err = dodUtility.getDomainError<PermissionDeniedError<Locale<'Permission denied'>>>(
      'Permission denied',
      'Действие не доступно',
      { allowedOnlyFor: this.supportedCallers },
    );
    return failure(err);
  }

  protected checkValidations(
    input: S_PARAMS['input'],
  ): Result<ValidationError, undefined> {
    if ((input as any).attrs === undefined) {
      throw this.logger.error('validate implemented only requestDod and eventDod');
    }
    const result = this.validator.validate((input as any).attrs);

    if (result.isFailure()) {
      const err: ValidationError = {
        name: 'Validation error',
        meta: {
          domainType: 'error',
          errorType: 'app-error',
        },
        errors: result.value,
      };
      return failure(err);
    }
    return result;
  }
}
