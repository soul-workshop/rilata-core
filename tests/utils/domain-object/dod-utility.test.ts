import { describe, test, expect } from 'bun:test';
import { dodUtility } from '../../../src/common/utils/domain-object/dod-utility';
import { DODPrivateFixtures as DODF } from '../../dod-private-fixtures';

const sut = dodUtility;

describe('test DODUtility class', () => {
  describe('получение DOD ошибки уровня приложения', () => {
    test('получили объект attrs', () => {
      const errAttrs = { traceback: 'any object' } as const;
      const appError = sut.getAppErrorByType<DODF.InternalAppError>('InternalAppError', 'app-error', errAttrs);

      expect(appError.locale.hint).toStrictEqual({ traceback: 'any object' });
    });

    test('получили ожидаемую метаинформацию', () => {
      const errAttrs = { traceback: 'any object' } as const;
      const appError = sut.getAppErrorByType<DODF.InternalAppError>('InternalAppError', 'app-error', errAttrs);

      expect(appError.meta.name).toStrictEqual('InternalAppError');
      expect(appError.meta.domainType).toStrictEqual('error');
      expect(appError.meta.errorType).toStrictEqual('app-error');
    });

    test('получили ожидаемый DOD объект ошибки уровня приложения', () => {
      const errAttrs = { traceback: 'any object' } as const;
      const appError = sut.getAppErrorByType<DODF.InternalAppError>('InternalAppError', 'app-error', errAttrs);

      expect(appError).toStrictEqual({
        locale: {
          text: 'app-error',
          hint: {
            traceback: errAttrs.traceback,
          },
        },
        name: 'InternalAppError',
        domainType: 'error',
        errorType: 'app-error',
      });
    });
  });

  describe('получение DOD доменной ошибки', () => {
    test('получили объект attrs', () => {
      const errAttrs = { personId: '5' };
      const domainError = sut
        .getDomainErrorByType<DODF.PersonNotExitsErrorDOD>('PersonNotExistError', 'domain-error', errAttrs);

      expect(domainError.locale.hint).toStrictEqual({ personId: '5' });
    });

    test('получили ожидаемую метаинформацию', () => {
      const errAttrs = { personId: '5' };
      const domainError = sut
        .getDomainErrorByType<DODF.PersonNotExitsErrorDOD>('PersonNotExistError', 'domain-error', errAttrs);

      expect(domainError.meta.name).toEqual('PersonNotExistError');
      expect(domainError.meta.domainType).toEqual('error');
      expect(domainError.meta.errorType).toEqual('domain-error');
    });

    test('получили ожидаемый DOD объект доменной ошибки', () => {
      const errAttrs = { personId: '5' };
      const domainError = sut
        .getDomainErrorByType<DODF.PersonNotExitsErrorDOD>('PersonNotExistError', 'domain-error', errAttrs);

      expect(domainError).toStrictEqual({
        locale: {
          text: 'domain-error',
          hint: {
            personId: errAttrs.personId,
          },
        },
        name: 'PersonNotExistError',
        domainType: 'error',
        errorType: 'domain-error',
      });
    });
  });
});
