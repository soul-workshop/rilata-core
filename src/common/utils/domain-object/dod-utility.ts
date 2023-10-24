/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorDod, GeneralEventDod } from '../../../domain/domain-object-data/common-types';
import { Locale } from '../../../domain/locale';
import { uuidUtility } from '../uuid/uuid-utility';

/** Утилита для работы с объектами DomainObjectData */
export class DodUtility {
  getAppErrorByType<ERR extends ErrorDod<Locale, string, 'app-error'>>(
    name: ERR['name'],
    text: ERR['locale']['text'],
    hint: ERR['locale']['hint'],
  ): ERR {
    return {
      name,
      locale: { text, hint },
      errorType: 'app-error',
      domainType: 'error',
    } as ERR;
  }

  getDomainErrorByType<ERR extends ErrorDod<Locale, string, 'domain-error'>>(
    name: ERR['name'],
    text: ERR['locale']['text'],
    hint: ERR['locale']['hint'],
  ): ERR {
    return {
      name,
      locale: { text, hint },
      errorType: 'domain-error',
      domainType: 'error',
    } as ERR;
  }

  getEventByType<EV extends GeneralEventDod>(name: EV['name'], attrs: EV['attrs'], caller: EV['caller']): EV {
    return {
      name,
      caller,
      attrs,
      domainType: 'event',
      eventId: uuidUtility.getNewUUID(),
    } as EV;
  }
}

export const dodUtility = Object.freeze(new DodUtility());
