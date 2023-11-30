import { describe, test, expect } from 'bun:test';
import { dodUtility } from '../../../src/common/utils/domain-object/dod-utility';
import { DODPrivateFixtures as DODF } from '../../dod-private-fixtures';
import { uuidUtility } from '../../../src/common/utils/uuid/uuid-utility';
import { dtoUtility } from '../../../src/common/utils/dto/dto-utility';

const sut = dodUtility;

const requestID = uuidUtility.getNewUUID();

describe('test DODUtility class', () => {
  describe('получение attrs объекта события', () => {
    test('получили тот же объект attrs что передали', () => {
      const phoneAddedEvent = sut.getEventByType<
          DODF.PersonPhoneAddedEventDOD
          >('PersonPhoneAddedEvent', dtoUtility.deepCopy(DODF.phoneAttrs), {
            type: 'AnonymousUser',
            requestID,
          });

      const eventID = phoneAddedEvent.eventId;

      expect(phoneAddedEvent).toStrictEqual({
        name: 'PersonPhoneAddedEvent',
        caller: {
          type: 'AnonymousUser',
          requestID,
        },
        attrs: {
          number: '+7-777-287-81-82',
          type: 'mobile',
          noOutField: 'empty info',
        },
        domainType: 'event',
        eventId: eventID,
      });
    });
  });

  describe('получение DOD ошибки уровня приложения', () => {
    test('получили объект attrs', () => {
      const errAttrs = { traceback: 'any object' } as const;
      const appError = sut.getAppErrorByType<DODF.InternalAppError>('InternalAppError', 'app-error', errAttrs);

      expect(appError.locale.hint).toStrictEqual({ traceback: 'any object' });
    });

    test('получили ожидаемую метаинформацию', () => {
      const errAttrs = { traceback: 'any object' } as const;
      const appError = sut.getAppErrorByType<DODF.InternalAppError>('InternalAppError', 'app-error', errAttrs);

      expect(appError.name).toStrictEqual('InternalAppError');
      expect(appError.domainType).toStrictEqual('error');
      expect(appError.errorType).toStrictEqual('app-error');
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

      expect(domainError.name).toEqual('PersonNotExistError');
      expect(domainError.domainType).toEqual('error');
      expect(domainError.errorType).toEqual('domain-error');
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
