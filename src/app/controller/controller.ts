import { ActionDod } from '../../domain/domain-data/domain-types';
import { Caller } from '../caller';
import { InternalError, AppBaseErrors } from '../service/error-types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';
import { storeDispatcher } from '../async-store/store-dispatcher';
import { ModuleResolver } from '../resolves/module-resolver';
import { StorePayload } from '../async-store/types';

type ExpressResponse = {
  status(status: number): ExpressResponse,
  send(payload: unknown): ExpressResponse,
}

export abstract class Controller {
  STATUS_CODES: Record<AppBaseErrors['meta']['name'], number> = {
    'Not found': 404,
    'Permission denied': 403,
    'Internal error': 500,
    'Bad request': 400,
    'Validation error': 400,
  };

  constructor(protected moduleResolver: ModuleResolver, protected runMode: string) {}

  protected async executeService(
    actionDod: ActionDod,
    caller: Caller,
    response: ExpressResponse,
  ): Promise<void> {
    try {
      const actionName = actionDod.meta.name;
      const service = this.moduleResolver.getModule().getServiceByName(actionName);

      const store: StorePayload = {
        caller,
        moduleResolver: this.moduleResolver,
        actionId: actionDod.meta.actionId,
      };
      const threadStore = storeDispatcher.getThreadStore();
      const serviceResult = await threadStore.run(
        store,
        (aDod) => service.execute(aDod),
        actionDod,
      );

      if (serviceResult.isSuccess() === true) {
        response.status(200);
      } else if (serviceResult.isFailure()) {
        const err = serviceResult.value as AppBaseErrors;
        response.status(this.STATUS_CODES[err.meta.name]);
      }

      response.send({
        success: serviceResult.isSuccess(),
        payload: serviceResult.value,
      });
    } catch (e) {
      if (this.runMode.includes('test')) {
        throw e;
      }
      this.moduleResolver.getLogger().fatalError('server internal error', { actionDod, caller });
      const err = dodUtility.getAppErrorByType<InternalError<Locale>>(
        'Internal error',
        'Извините, на сервере произошла ошибка',
        {},
      );

      response.send({
        success: false,
        payload: err,
      });
    }
  }
}
