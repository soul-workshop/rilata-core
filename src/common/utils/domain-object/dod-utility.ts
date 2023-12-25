/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorDod } from '../../../domain/domain-object-data/common-types';
import { Locale } from '../../../domain/locale';

/** Утилита для работы с объектами DomainObjectData */
class DodUtility {
  getAppErrorByType<ERR extends ErrorDod<Locale, string, 'app-error'>>(
    name: ERR['meta']['name'],
    text: ERR['locale']['text'],
    hint: ERR['locale']['hint'],
  ): ERR {
    return {
      locale: { text, hint },
      meta: {
        name,
        errorType: 'app-error',
        domainType: 'error',
      },
    } as ERR;
  }

  getDomainErrorByType<ERR extends ErrorDod<Locale, string, 'domain-error'>>(
    name: ERR['meta']['name'],
    text: ERR['locale']['text'],
    hint: ERR['locale']['hint'],
  ): ERR {
    return {
      locale: { text, hint },
      meta: {
        name,
        errorType: 'domain-error',
        domainType: 'error',
      },
    } as ERR;
  }
}

export const dodUtility = Object.freeze(new DodUtility());
