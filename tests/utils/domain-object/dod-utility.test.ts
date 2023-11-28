import { describe, test, expect } from 'bun:test';
import { dodUtility } from '../../../src/common/utils/domain-object/dod-utility';
import { DODPrivateFixtures as DODF } from '../../dod-private-fixtures';
import { uuidUtility } from '../../../src/common/utils/uuid/uuid-utility';
import { dtoUtility } from '../../../src/common/utils/dto/dto-utility';

const sut = dodUtility;

describe('test DODUtility class', () => {
  describe('получение DOD объекта события', () => {
    test('получили тот же объект attrs что передали', () => {
      const phoneAddedEventAttrs = {
        ...dtoUtility.deepCopy(DODF.phoneAttrs),
      };

      const eventID = uuidUtility.getNewUUID();

      const phoneAddedEvent = sut.getEventByType<
          DODF.PersonPhoneAddedEventDOD
          >('PersonPhoneAddedEvent', phoneAddedEventAttrs, {
            type: 'AnonymousUser',
            requestID: eventID,
          });

      expect(phoneAddedEvent.attrs).toBe(phoneAddedEventAttrs);
      expect(phoneAddedEvent.attrs).toStrictEqual(phoneAddedEventAttrs);
    });

    test('получили ожидаемую метаинформацию', () => {
      const phoneAddedEventAttrs = {
        ...dtoUtility.deepCopy(DODF.phoneAttrs),
      };

      const eventID = uuidUtility.getNewUUID();

      const phoneAddedEvent = sut.getEventByType<
          DODF.PersonPhoneAddedEventDOD
          >('PersonPhoneAddedEvent', phoneAddedEventAttrs, {
            type: 'AnonymousUser',
            requestID: eventID,
          });

      const expectedMeta: DODF.PersonPhoneAddedEventDOD = ({
        attrs: {
          number: '+7-777-287-81-82',
          type: 'mobile',
          noOutField: 'empty info',
        },
        name: 'PersonPhoneAddedEvent',
        domainType: 'event',
        eventId: eventID,
        caller: {
          type: 'AnonymousUser',
          requestID: eventID,
        },
      });
      expect(phoneAddedEvent.attrs).toStrictEqual(expectedMeta.attrs);
    });
  });

  describe('получение DOD ошибки уровня приложения', () => {
    test('получили объект attrs', () => {
      const errAttrs = { traceback: 'any object' } as const;
      const appError = sut.getAppErrorByType<DODF.InternalAppError>('InternalError', 'app-error', errAttrs);

      expect(appError.locale.hint.traceback).toBe(errAttrs.traceback);
      expect(appError.locale.hint).toStrictEqual(errAttrs);
    });

    test('получили ожидаемую метаинформацию', () => {
      const errAttrs = { traceback: 'any object' } as const;
      const appError = sut.getAppErrorByType<DODF.InternalAppError>('InternalError', 'app-error', errAttrs);

      const expectedMeta: DODF.InternalAppError = {
        locale: {
          text: 'app-error',
          hint: {
            traceback: errAttrs.traceback,
          },
        },
        name: 'InternalError',
        domainType: 'error',
        errorType: 'app-error',
      };
      expect(appError.locale).toStrictEqual(expectedMeta.locale);
    });
  });

  describe('получение DOD доменной ошибки', () => {
    test('получили объект attrs', () => {
      const errAttrs = { personId: '5' };
      const domainError = sut
        .getDomainErrorByType<DODF.PersonNotExitsErrorDOD>('PersonNotExitsError', 'domain-error', errAttrs);

      expect(domainError.locale.hint.personId).toBe(errAttrs.personId);
      expect(domainError.locale.hint).toStrictEqual(errAttrs);
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
      expect(domainError.locale).toStrictEqual(expectedMeta.locale);
    });
  });
});
