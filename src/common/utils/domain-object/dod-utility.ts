import { storeDispatcher } from '../../../app/async-store/store-dispatcher';
import { Caller } from '../../../app/caller';
import { GeneralRequestDod, GeneralErrorDod, GeneralEventDod } from '../../../domain/domain-data/domain-types';
import { UuidType } from '../../types';
import { dtoUtility } from '../dto/dto-utility';
import { uuidUtility } from '../uuid/uuid-utility';

/** Утилита для работы с объектами DomainObjectData */
class DodUtility {
  getAppError<ERR extends GeneralErrorDod>(
    name: ERR['name'],
    text: ERR['locale']['text'],
    hint: ERR['locale']['hint'],
  ): ERR {
    return {
      locale: { text, hint, name },
      name,
      meta: {
        errorType: 'app-error',
        domainType: 'error',
      },
    } as ERR;
  }

  getDomainError<ERR extends GeneralErrorDod>(
    name: ERR['name'],
    text: ERR['locale']['text'],
    hint: ERR['locale']['hint'],
  ): ERR {
    return {
      locale: { text, hint, name },
      name,
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    } as ERR;
  }

  getEvent<E extends GeneralEventDod>(
    name: E['meta']['name'],
    attrs: E['attrs'],
    aRootAttrs: E['aRoot'],
    requestId?: E['meta']['requestId'],
    caller?: E['caller'],
    moduleName?: E['meta']['moduleName'],
  ): E {
    return {
      attrs,
      meta: {
        eventId: uuidUtility.getNewUUID(),
        requestId: requestId ?? this.getCurrentRequestId(),
        name,
        moduleName: moduleName ?? this.getCurrentModuleName(),
        domainType: 'event',
        created: Date.now(),
      },
      caller: caller ?? this.getCurrentCaller(),
      aRoot: aRootAttrs,
    } as E;
  }

  /** Перевыпустить событие. Используется для перевыпуска cmd события в read модуле. */
  regenerateEvent(event: GeneralEventDod, moduleName: string, newName?: string): GeneralEventDod {
    return dtoUtility.replaceAttrs(event, {
      meta: {
        name: newName ?? event.meta.name,
        eventId: uuidUtility.getNewUUID(),
        moduleName,
        created: Date.now(),
      },
    });
  }

  getRequestDod<A extends GeneralRequestDod>(
    name: A['meta']['name'],
    attrs: A['attrs'],
    requestId?: UuidType,
  ): A {
    return {
      meta: {
        name,
        requestId: requestId ?? uuidUtility.getNewUUID(),
        domainType: 'request',
      },
      attrs,
    } as A;
  }

  protected getCurrentRequestId(): string {
    return storeDispatcher.getStoreOrExepction().requestId;
  }

  protected getCurrentModuleName(): string {
    return storeDispatcher.getStoreOrExepction().moduleResolver.getModule().moduleName;
  }

  protected getCurrentCaller(): Caller {
    return storeDispatcher.getStoreOrExepction().caller;
  }
}

export const dodUtility = Object.freeze(new DodUtility());
