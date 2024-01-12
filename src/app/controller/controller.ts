import { ActionDod } from '../../domain/domain-data/domain-types';
import { Caller } from '../caller';
import { InternalError, ServiceBaseErrors } from '../service/error-types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';
import { storeDispatcher } from '../async-store/store-dispatcher';
import { ModuleResolver } from '../resolves/module-resolver';
import { StorePayload } from '../async-store/types';
import { STATUS_CODES } from './constants';
import { Result } from '../../common/result/types';

type ExpressResponse = {
  status(status: number): ExpressResponse,
  send(payload: unknown): ExpressResponse,
}

export abstract class Controller {
  constructor(protected moduleResolver: ModuleResolver) {}

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

      if (serviceResult.isSuccess()) {
        response.status(200);
        // приведение типа, потому что serviceResult становится never!;
      } else if ((serviceResult as Result<ServiceBaseErrors, never>).isFailure()) {
        const err = (serviceResult as Result<ServiceBaseErrors, never>).value;
        response.status(STATUS_CODES[err.name] ?? 400);
      }

      response.send({
        success: serviceResult.isSuccess(),
        payload: serviceResult.value,
      });
    } catch (e) {
      if (this.moduleResolver.getRunMode().includes('test')) {
        throw e;
      }
      this.moduleResolver.getLogger().fatalError('server internal error', { actionDod, caller }, e as Error);
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
