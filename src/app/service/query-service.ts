/* eslint-disable @typescript-eslint/no-unused-vars */
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';
import { CallerType } from '../caller';
import {
  GeneralQueryServiceParams, ServiceResult,
  GetActionDodBody, ActionDodValidator, GetActionDodName,
} from './types';
import { Service } from './service';
import { PermissionDeniedError, ValidationError } from './error-types';
import { storeDispatcher } from '../async-store/store-dispatcher';

export abstract class QueryService<S_PARAMS extends GeneralQueryServiceParams>
  extends Service {
  protected abstract override name: GetActionDodName<S_PARAMS>;

  protected abstract aRootName: S_PARAMS['aRootName'];

  protected abstract supportedCallers: ReadonlyArray<CallerType>;

  /** выполнение доменной логики */
  protected abstract runDomain(actionDod: S_PARAMS['actionDod']): Promise<ServiceResult<S_PARAMS>>

  protected abstract validatorMap: ActionDodValidator<S_PARAMS>;

  async execute(actionDod: S_PARAMS['actionDod']): Promise<ServiceResult<S_PARAMS>> {
    const checksResult = await this.runInitialChecks(actionDod);
    if (checksResult.isFailure()) return checksResult;
    return this.runDomain(actionDod);
  }

  /**
   * Выполнить проверку разрешений, которую можно выполнить до
   * выполнения доменной логики и её проверок.
   * */
  protected async runInitialChecks(
    actionDod: S_PARAMS['actionDod'],
  ): Promise<Result<ValidationError | PermissionDeniedError<Locale>, undefined>> {
    const checkCallerResult = this.checkCallerPermission();
    if (checkCallerResult.isFailure()) return checkCallerResult;

    return this.checkValidations(actionDod.attrs);
  }

  // eslint-disable-next-line max-len
  protected checkCallerPermission(): Result<PermissionDeniedError<Locale>, undefined> {
    const { caller } = storeDispatcher.getStoreOrExepction();
    if (this.supportedCallers.includes(caller.type)) return success(undefined);

    const err = dodUtility.getDomainErrorByType<PermissionDeniedError<Locale>>(
      'Permission denied',
      'Действие не доступно',
      { allowedOnlyFor: this.supportedCallers },
    );
    return failure(err);
  }

  protected checkValidations(
    actionDodBody: GetActionDodBody<S_PARAMS>,
  ): Result<ValidationError, undefined> {
    const result = this.validatorMap.validate(actionDodBody);

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
