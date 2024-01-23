/* eslint-disable no-use-before-define */
import { Result } from '../../common/result/types';
import { GetArrayType } from '../../common/type-functions';
import { GeneralARDParams } from '../../domain/domain-data/params-types';
import {
  GeneralErrorDod, GeneralEventDod, ActionDod,
} from '../../domain/domain-data/domain-types';
import { DtoFieldValidator } from '../../domain/validator/field-validator/dto-field-validator';
import { ModuleType } from '../module/types';
import { CommandService } from './command-service';
import { ServiceBaseErrors } from './error-types';
import { QueryService } from './query-service';

export type AppEventType = 'command-event' | 'read-module' | 'event';

export type GetAppEventDod<EVENTS extends GeneralEventDod[], M_TYPE extends ModuleType> =
  M_TYPE extends 'command-module'
    ? Array<GetArrayType<EVENTS> & { event: 'command-event' }>
    : M_TYPE extends 'read-module'
      ? Array<GetArrayType<EVENTS> & { event: 'read-event' }>
      : EVENTS

export type QueryServiceParams<
  AR_PARAMS extends GeneralARDParams,
  ACTION_DOD extends ActionDod, // что входит в service,
  SUCCESS_OUT, // ответ клиенту в случае успеха
  FAIL_OUT extends GeneralErrorDod, // возвращаемый ответ в случае не успеха
> = {
  aRootName: AR_PARAMS['meta']['name'],
  actionDod: ACTION_DOD,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
}

export type GeneralQueryServiceParams = QueryServiceParams<
  GeneralARDParams, ActionDod, unknown, GeneralErrorDod
>;

export type GeneraQueryService = QueryService<GeneralQueryServiceParams>;

export type CommandServiceParams<
  AR_PARAMS extends GeneralARDParams,
  ACTION_DOD extends ActionDod, // что входит в service,
  SUCCESS_OUT, // ответ в случае успеха
  FAIL_OUT extends GeneralErrorDod, // доменные ошибки при выполнении запроса
  EVENTS extends GeneralEventDod[], // публикуемые доменные события
> = {
  aRootName: AR_PARAMS['meta']['name'],
  actionDod: ACTION_DOD,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
  events: EVENTS,
}

export type GeneralCommandServiceParams = CommandServiceParams<
  GeneralARDParams, ActionDod, unknown, GeneralErrorDod, GeneralEventDod[]
>;

export type GeneralCommandService = CommandService<GeneralCommandServiceParams>;

export type ActionDodValidator<
  S_PARAMS extends GeneralQueryServiceParams | GeneralCommandServiceParams
> =
  DtoFieldValidator<
    GetActionDodName<S_PARAMS>,
    true, false,
    GetActionDodBody<S_PARAMS>
  >

export type ServiceResult<
  P extends GeneralQueryServiceParams | GeneralCommandServiceParams
> = Result<
  P['errors'] | ServiceBaseErrors,
  P['successOut']
>

export type GetServiceErrorsResult<
  P extends GeneralQueryServiceParams | GeneralCommandServiceParams
> = Result<P['errors'] | ServiceBaseErrors, never>

export type GetActionDodName<
  S_PARAMS extends GeneralQueryServiceParams | GeneralCommandServiceParams
> = S_PARAMS['actionDod']['meta']['name']

export type GetActionDodBody<
  S_PARAMS extends GeneralQueryServiceParams | GeneralCommandServiceParams
> = S_PARAMS['actionDod']['attrs']
