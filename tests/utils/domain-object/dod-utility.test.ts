import { describe, test, expect } from 'bun:test';
import { dodUtility } from '../../../src/common/utils/domain-object/dod-utility';
import { DODPrivateFixtures as DODF } from '../../dod-private-fixtures';
import { uuidUtility } from '../../../src/common/utils/uuid/uuid-utility';
import { dtoUtility } from '../../../src/common/utils/dto/dto-utility';

const sut = dodUtility;

describe('test DODUtility class', () => {
  describe('получение attrs объекта события', () => {
    const requestID = uuidUtility.getNewUUID();

    test('получили тот же объект attrs что передали', () => {
      const phoneAddedEventAttrs = {
        ...dtoUtility.deepCopy(DODF.phoneAttrs),
      };

      const phoneAddedEvent = sut.getEventByType<
          DODF.PersonPhoneAddedEventDOD
          >('PersonPhoneAddedEvent', phoneAddedEventAttrs, {
            type: 'AnonymousUser',
            requestID,
          });

      expect(phoneAddedEvent.attrs).toStrictEqual({
        number: '+7-777-287-81-82',
        type: 'mobile',
        noOutField: 'empty info',
      });
    });

    test('получили ожидаемую метаинформацию', () => {
      const phoneAddedEventAttrs = {
        ...dtoUtility.deepCopy(DODF.phoneAttrs),
      };

      const phoneAddedEvent = sut.getEventByType<
          DODF.PersonPhoneAddedEventDOD
          >('PersonPhoneAddedEvent', phoneAddedEventAttrs, {
            type: 'AnonymousUser',
            requestID,
          });

      const expectedMeta: DODF.PersonPhoneAddedEventDOD = {
        attrs: {
          number: '+7-777-287-81-82',
          type: 'mobile',
          noOutField: 'empty info',
        },
        name: 'PersonPhoneAddedEvent',
        domainType: 'event',
        eventId: phoneAddedEvent.eventId,
        caller: {
          type: 'AnonymousUser',
          requestID: phoneAddedEvent.eventId,
        },
      };

      expect(phoneAddedEvent.name).toStrictEqual('PersonPhoneAddedEvent');
      expect(phoneAddedEvent.domainType).toStrictEqual('event');
      expect(phoneAddedEvent.eventId).toStrictEqual(expectedMeta.eventId);
      expect(phoneAddedEvent.caller).toStrictEqual({
        type: 'AnonymousUser',
        requestID,
      });
    });

    test('получили ожидаемый DOD объект события', () => {
      const phoneAddedEventAttrs = {
        ...dtoUtility.deepCopy(DODF.phoneAttrs),
      };

      const phoneAddedEvent = sut.getEventByType<
          DODF.PersonPhoneAddedEventDOD
          >('PersonPhoneAddedEvent', phoneAddedEventAttrs, {
            type: 'AnonymousUser',
            requestID,
          });

      const expectedMeta: DODF.PersonPhoneAddedEventDOD = {
        attrs: {
          number: '+7-777-287-81-82',
          type: 'mobile',
          noOutField: 'empty info',
        },
        name: 'PersonPhoneAddedEvent',
        domainType: 'event',
        eventId: phoneAddedEvent.eventId,
        caller: {
          type: 'AnonymousUser',
          requestID: phoneAddedEvent.eventId,
        },
      };

      expect(phoneAddedEvent.attrs.number).toStrictEqual('+7-777-287-81-82');
      expect(phoneAddedEvent.attrs.type).toStrictEqual('mobile');
      expect(phoneAddedEvent.attrs.noOutField).toStrictEqual('empty info');
      expect(phoneAddedEvent.name).toStrictEqual('PersonPhoneAddedEvent');
      expect(phoneAddedEvent.domainType).toStrictEqual('event');
      expect(phoneAddedEvent.eventId).toStrictEqual(expectedMeta.eventId);
      expect(phoneAddedEvent.caller).toStrictEqual({
        type: 'AnonymousUser',
        requestID,
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

      const expectedMeta: DODF.InternalAppError = {
        locale: {
          text: 'app-error',
          hint: {
            traceback: errAttrs.traceback,
          },
        },
        name: 'InternalAppError',
        domainType: 'error',
        errorType: 'app-error',
      };

      expect(appError.name).toStrictEqual('InternalAppError');
      expect(appError.domainType).toStrictEqual('error');
      expect(appError.errorType).toStrictEqual('app-error');
    });

    test('получили ожидаемый DOD объект ошибки уровня приложения', () => {
      const errAttrs = { traceback: 'any object' } as const;
      const appError = sut.getAppErrorByType<DODF.InternalAppError>('InternalAppError', 'app-error', errAttrs);

      const expectedMeta: DODF.InternalAppError = {
        locale: {
          text: 'app-error',
          hint: {
            traceback: errAttrs.traceback,
          },
        },
        name: 'InternalAppError',
        domainType: 'error',
        errorType: 'app-error',
      };

      expect(appError.locale.text).toStrictEqual('app-error');
      expect(appError.locale.hint).toStrictEqual({ traceback: 'any object' });
      expect(appError.name).toStrictEqual('InternalAppError');
      expect(appError.domainType).toStrictEqual('error');
      expect(appError.errorType).toStrictEqual('app-error');
    });
  });

  describe('получение DOD доменной ошибки', () => {
    test('получили объект attrs', () => {
      const errAttrs = { personId: '5' };
      const domainError = sut
        .getDomainErrorByType<DODF.PersonNotExitsErrorDOD>('PersonNotExitsError', 'domain-error', errAttrs);

      expect(domainError.locale.hint).toStrictEqual({ personId: '5' });
    });

    test('получили ожидаемую метаинформацию', () => {
      const errAttrs = { personId: '5' };
      const domainError = sut
        .getDomainErrorByType<DODF.PersonNotExitsErrorDOD>('PersonNotExitsError', 'domain-error', errAttrs);

      const expectedMeta: DODF.PersonNotExitsErrorDOD = {
        locale: {
          text: 'domain-error',
          hint: {
            personId: errAttrs.personId,
          },
        },
        name: 'PersonNotExitsError',
        domainType: 'error',
        errorType: 'domain-error',
      };

      expect(domainError.name).toEqual('PersonNotExitsError');
      expect(domainError.domainType).toEqual('error');
      expect(domainError.errorType).toEqual('domain-error');
    });

    test('получили ожидаемый DOD объект доменной ошибки', () => {
      const errAttrs = { personId: '5' };
      const domainError = sut
        .getDomainErrorByType<DODF.PersonNotExitsErrorDOD>('PersonNotExitsError', 'domain-error', errAttrs);

      const expectedMeta: DODF.PersonNotExitsErrorDOD = {
        locale: {
          text: 'domain-error',
          hint: {
            personId: errAttrs.personId,
          },
        },
        name: 'PersonNotExitsError',
        domainType: 'error',
        errorType: 'domain-error',
      };

      expect(domainError.locale.text).toStrictEqual('domain-error');
      expect(domainError.locale.hint).toStrictEqual({ personId: '5' });
      expect(domainError.name).toStrictEqual('PersonNotExitsError');
      expect(domainError.domainType).toStrictEqual('error');
      expect(domainError.errorType).toStrictEqual('domain-error');
    });
  });
});
