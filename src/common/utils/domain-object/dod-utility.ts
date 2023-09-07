/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorDod } from '../../../domain/domain-object-data/common-types';
import { LocaleHint } from '../../../domain/locale';

/** Утилита для работы с объектами DomainObjectData */
class DodUtility {
  getDomainError<
    N extends string, TXT extends string, HINT extends LocaleHint
  >(name: N, text: TXT, hint?: HINT): ErrorDod<{ text: TXT, hint: HINT }, N, 'domain-error'> {
    return {
      name,
      locale: {
        text,
        hint: hint ?? {} as HINT,
      },
      errorType: 'domain-error',
      domainType: 'error',
    };
  }

  getAppError<
    N extends string, TXT extends string, HINT extends LocaleHint
  >(name: N, text: TXT, hint?: HINT): ErrorDod<{ text: TXT, hint: HINT }, N, 'app-error'> {
    return {
      name,
      locale: {
        text,
        hint: hint ?? {} as HINT,
      },
      errorType: 'app-error',
      domainType: 'error',
    };
  }
}

export const dodUtility = Object.freeze(new DodUtility());
