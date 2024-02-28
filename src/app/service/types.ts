/* eslint-disable no-use-before-define */
import { Result } from '../../common/result/types';
import { GetArrayType } from '../../common/type-functions';
import { GeneralARDParams } from '../../domain/domain-data/params-types';
import {
  GeneralErrorDod, GeneralEventDod, GeneralRequestDod,
} from '../../domain/domain-data/domain-types';
import { DtoFieldValidator } from '../../domain/validator/field-validator/dto-field-validator';
import { ModuleType } from '../module/types';
import { CommandService } from './command-service';
import { ServiceBaseErrors } from './error-types';
import { QueryService } from './query-service';
import { DTO } from '../../domain/dto';
import { EventService } from './event-service';

export type AppEventType = 'command-event' | 'read-module' | 'event';

export type GetAppEventDod<EVENTS extends GeneralEventDod[], M_TYPE extends ModuleType> =
  M_TYPE extends 'command-module'
    ? Array<GetArrayType<EVENTS> & { event: 'command-event' }>
    : M_TYPE extends 'read-module'
      ? Array<GetArrayType<EVENTS> & { event: 'read-event' }>
      : EVENTS

export type BaseServiceParams<
  AR_PARAMS extends GeneralARDParams,
  IN extends DTO, // что входит в service,
  SUCCESS_OUT, // ответ клиенту в случае успеха
  FAIL_OUT, // возвращаемый ответ в случае не успеха
  EVENTS, // публикуемые доменные события
> = {
  aRootName: AR_PARAMS['meta']['name'],
  input: IN,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
  events: EVENTS
}

export type GeneralBaseServiceParams = BaseServiceParams<
  GeneralARDParams, DTO, unknown, unknown, unknown
>

export type QueryServiceParams<
  AR_PARAMS extends GeneralARDParams,
  ACTION_DOD extends GeneralRequestDod, // что входит в service,
  SUCCESS_OUT, // ответ клиенту в случае успеха
  FAIL_OUT extends GeneralErrorDod, // возвращаемый ответ в случае не успеха
> = BaseServiceParams<
  AR_PARAMS, ACTION_DOD, SUCCESS_OUT, FAIL_OUT, never
>
export type GeneralQueryServiceParams = QueryServiceParams<
  GeneralARDParams, GeneralRequestDod, unknown, GeneralErrorDod
>;

export type GeneraQueryService = QueryService<GeneralQueryServiceParams>;

export type CommandServiceParams<
  AR_PARAMS extends GeneralARDParams,
  ACTION_DOD extends GeneralRequestDod, // что входит в service,
  SUCCESS_OUT, // ответ в случае успеха
  FAIL_OUT extends GeneralErrorDod, // доменные ошибки при выполнении запроса
  EVENTS extends GeneralEventDod[], // публикуемые доменные события
> = BaseServiceParams<
  AR_PARAMS, ACTION_DOD, SUCCESS_OUT, FAIL_OUT, EVENTS
>

export type GeneralCommandServiceParams = CommandServiceParams<
  GeneralARDParams, GeneralRequestDod, unknown, GeneralErrorDod, GeneralEventDod[]
>;

export type GeneralCommandService = CommandService<GeneralCommandServiceParams>;

export type EventServiceParams<
  AR_PARAMS extends GeneralARDParams,
  EVENT_DOD extends GeneralEventDod, // входящее событие,
  EVENTS extends GeneralEventDod[], // публикуемые доменные события
> = BaseServiceParams<AR_PARAMS, EVENT_DOD, void, never, EVENTS>

export type GeneralEventServiceParams =
  EventServiceParams<GeneralARDParams, GeneralEventDod, GeneralEventDod[]>

export type GeneralEventService = EventService<GeneralEventServiceParams>;

export type RequestDodValidator<
  S_PARAMS extends GeneralBaseServiceParams
> = DtoFieldValidator<
    GetServiceName<S_PARAMS>,
    true, false,
    GetValidationBody<S_PARAMS>
  >

export type ServiceResult<
  P extends GeneralBaseServiceParams
> = Result<
  P['errors'],
  P['successOut']
>

export type GetServiceErrorsResult<
  P extends GeneralQueryServiceParams | GeneralCommandServiceParams
> = Result<P['errors'] | ServiceBaseErrors, never>

export type GetServiceName<PARAMS extends GeneralBaseServiceParams> =
  PARAMS extends GeneralQueryServiceParams | GeneralCommandServiceParams | GeneralEventServiceParams
    ? PARAMS['input']['meta']['name']
    : string

export type GetValidationBody<PARAMS extends GeneralBaseServiceParams> =
  PARAMS extends GeneralQueryServiceParams | GeneralCommandServiceParams | GeneralEventServiceParams
    ? PARAMS['input']['attrs']
    : PARAMS
