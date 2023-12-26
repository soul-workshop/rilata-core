/* eslint-disable @typescript-eslint/no-unused-vars */
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';
import { CallerType } from '../caller';
import {
  GeneralQueryUcParams, UcResult,
  GetActionDodBody, ActionDodValidator, GetActionDodName,
} from './types';
import { UseCase } from './use-case';
import { PermissionDeniedError, ValidationError } from './error-types';
import { storeDispatcher } from '../async-store/store-dispatcher';

export abstract class QueryUseCase<UC_PARAMS extends GeneralQueryUcParams>
  extends UseCase {
  protected abstract override name: GetActionDodName<UC_PARAMS>;

  protected abstract aRootName: UC_PARAMS['aRootName'];

  protected abstract supportedCallers: ReadonlyArray<CallerType>;

  /** выполнение доменной логики */
  protected abstract runDomain(actionDod: UC_PARAMS['actionDod']): Promise<UcResult<UC_PARAMS>>

  protected abstract validatorMap: ActionDodValidator<UC_PARAMS>;

  async execute(actionDod: UC_PARAMS['actionDod']): Promise<UcResult<UC_PARAMS>> {
    const checksResult = await this.runInitialChecks(actionDod);
    if (checksResult.isFailure()) return checksResult;
    return this.runDomain(actionDod);
  }

  /**
   * Выполнить проверку разрешений, которую можно выполнить до
   * выполнения доменной логики и её проверок.
   * */
  protected async runInitialChecks(
    actionDod: UC_PARAMS['actionDod'],
  ): Promise<Result<ValidationError | PermissionDeniedError<Locale>, undefined>> {
    const checkCallerResult = this.checkCallerPermission();
    if (checkCallerResult.isFailure()) return checkCallerResult;

    return this.checkValidations(actionDod.body);
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
    actionDodBody: GetActionDodBody<UC_PARAMS>,
  ): Result<ValidationError, undefined> {
    const result = this.validatorMap.validate(actionDodBody);

    if (result.isFailure()) {
      const err: ValidationError = {
        meta: {
          name: 'Validation error',
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
