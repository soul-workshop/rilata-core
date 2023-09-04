/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GeneralErrorDod } from '../../../domain/domain-object-data/types';
import { LocaleHint } from '../../../domain/locale';

/** Утилита для работы с объектами DomainObjectData */
class DodUtility {
  getDomainError(name: string, errText: string, hint?: LocaleHint): GeneralErrorDod {
    return {
      name,
      locale: {
        text: errText,
        hint: hint ?? {},
      },
      errorType: 'domain-error',
      domainType: 'error',
    };
  }

  getAppError(name: string, errText: string, hint?: LocaleHint): GeneralErrorDod {
    return {
      name,
      locale: {
        text: errText,
        hint: hint ?? {},
      },
      errorType: 'app-error',
      domainType: 'error',
    };
  }
}

export const dodUtility = Object.freeze(new DodUtility());
