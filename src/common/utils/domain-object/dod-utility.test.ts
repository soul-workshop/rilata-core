import { DODPrivateFixtures as DODF } from '../../../domain/domain-object-data/dod-private-fixtures';
import { AggregateVersion } from '../../../app/infra/rilata-backend-fronted/domain-object-data/domain-objects';
import { GetDODMeta } from '../../../domain/domain-object-data/types';
import { dtoUtility } from '../dto';
import { UUIDUtility } from '../uuid/uuid-utility';
import { dodUtility } from './dod-utility';

const sut = dodUtility;

describe('test DODUtility class', () => {
  describe('получение экспортной (на выход) DOD', () => {
    test('возвращается полная копия объекта состояния', () => {
      const phoneOutputStruct = sut.getOutput(DODF.phoneDOD);

      expect(phoneOutputStruct).not.toBe(DODF.phoneDOD);
      expect(phoneOutputStruct.attrs).not.toBe(DODF.phoneDOD.attrs);

      const attrsKeys = new Set(Object.keys(phoneOutputStruct.attrs));
      const expectAttrsKeys = new Set(['number', 'type']);
      expect(attrsKeys).toEqual(expectAttrsKeys);

      expect(phoneOutputStruct.attrs.number).toBe(DODF.phoneAttrs.number);
      expect(phoneOutputStruct.attrs.type).toBe(DODF.phoneAttrs.type);
    });

    test('в объекте состояния необходимые поля исключены', () => {
      const personOutputStruct = sut.getOutput(DODF.personDOD);

      const expectedAttrNames = Object.keys(personOutputStruct.attrs);
      const excludeAttrs = DODF.personDOD.meta.noOutputAttrs;

      excludeAttrs.forEach((attrName) => {
        expect(expectedAttrNames).not.toContain(attrName);
      });
      expect((personOutputStruct.meta as unknown as { version: AggregateVersion }).version)
        .toBeUndefined();
    });

    test('в объекте метаинформации исключен атрибут неэкспортируемых полей', () => {
      const phoneOutputStruct = sut.getOutput(DODF.phoneDOD);

      expect(phoneOutputStruct.meta).not.toBe(DODF.phoneDOD.meta);

      const attributeIsIncluded = Object.keys(phoneOutputStruct.meta).includes('noOutputAttrs');
      expect(attributeIsIncluded).toBe(false);
    });

    test('в объекте метаинформации присутствует атрибут, '
          + 'определяющий, что ДОД стал output', () => {
      const phoneOutputStruct = sut.getOutput(DODF.phoneDOD);

      expect(phoneOutputStruct.meta).not.toBe(DODF.phoneDOD.meta);

      const attributeIsIncluded = Object.keys(phoneOutputStruct.meta).includes('output');
      expect(attributeIsIncluded).toBe(true);
    });

    test('Вложенные ДОДЫ тоже преобразовываются в output', () => {
      const personOutDOD = sut.getOutput(DODF.personDOD);
      expect(personOutDOD).toStrictEqual(DODF.personOutputDOD);
      expect(Object.keys(personOutDOD.attrs.contacts.meta).includes('output')).toBeTruthy();
      expect(Object.keys(personOutDOD.attrs.contacts.attrs).includes('noOutField')).toBeFalsy();
      const phoneOutDOD = personOutDOD.attrs.contacts.attrs.phones[0];
      expect(phoneOutDOD).toStrictEqual(DODF.phoneOutputDOD);
      expect(Object.keys(phoneOutDOD.meta).includes('output')).toBeTruthy();
      expect(Object.keys(phoneOutDOD.meta).includes('type')).toBeFalsy();
      const emailOutDOD = personOutDOD.attrs.contacts.attrs.email;
      expect(emailOutDOD).toStrictEqual(DODF.emailOutputDOD);
      expect(Object.keys(emailOutDOD.meta).includes('output')).toBeTruthy();
      expect(Object.keys(emailOutDOD.meta).includes('type')).toBeFalsy();
    });
  });

  describe('получение DOD различных объектов', () => {
    describe('получение DOD агрегата', () => {
      test('получили копию объекта attrs', () => {
        const personAttrs = dtoUtility.deepCopy(DODF.personAttrs);
        const personAggregate = sut.getAggregate<
          DODF.PersonDOD
        >('Person', personAttrs, 0, ['birthday']);

        expect(personAggregate.attrs).not.toBe(personAttrs);
        expect(personAggregate.attrs).toStrictEqual(personAttrs);
      });

      test('получили тот же объект attrs что передали', () => {
        const personAttrs = dtoUtility.deepCopy(DODF.personAttrs);
        const personAggregate = sut.getAggregate<
          DODF.PersonDOD
        >('Person', personAttrs, 0, ['birthday'], false);

        expect(personAggregate.attrs).toBe(personAttrs);
        expect(personAggregate.attrs).toStrictEqual(personAttrs);
        personAggregate.meta.noOutputAttrs;
      });

      test('получили ожидаемую метаинформацию', () => {
        const personAttrs = dtoUtility.deepCopy(DODF.personAttrs);
        const personAggregate = sut.getAggregate<
          DODF.PersonDOD
        >('Person', personAttrs, 2, ['birthday']);

        const expectedMeta: DODF.PersonMeta = {
          name: 'Person',
          objectType: 'aggregate',
          domainType: 'object',
          version: 2,
          noOutputAttrs: ['birthday'],
        };
        expect(personAggregate.meta).toStrictEqual(expectedMeta);
      });
    });

    describe('получение DOD сущности', () => {
      test('получили копию объекта attrs', () => {
        const personAttrs = dtoUtility.deepCopy(DODF.personAttrs);
        const personEntity = sut.getEntity('PersonEntity', personAttrs, []);

        expect(personEntity.attrs).not.toBe(personAttrs);
        expect(personEntity.attrs).toStrictEqual(personAttrs);
      });

      test('получили тот же объект attrs что передали', () => {
        const personAttrs = dtoUtility.deepCopy(DODF.personAttrs);
        const personEntity = sut.getEntity<
          DODF.PersonEntityDOD
        >('PersonEntity', personAttrs, [], false);

        expect(personEntity.attrs).toBe(personAttrs);
        expect(personEntity.attrs).toStrictEqual(personAttrs);
      });

      test('получили ожидаемую метаинформацию', () => {
        const personAttrs = dtoUtility.deepCopy(DODF.personAttrs);
        const personEntity = sut.getEntity<
          DODF.PersonEntityDOD
        >('PersonEntity', personAttrs, []);

        const expectedMeta: DODF.PersonEntityMeta = {
          name: 'PersonEntity',
          objectType: 'entity',
          domainType: 'object',
          noOutputAttrs: [],
        };
        expect(personEntity.meta).toStrictEqual(expectedMeta);
      });
    });

    describe('получение DOD объекта-значения', () => {
      test('получили копию объекта attrs', () => {
        const phoneAttrs = dtoUtility.deepCopy(DODF.phoneAttrs);
        const phoneObject = sut.getValueObject<DODF.PhoneDOD>('Phone', phoneAttrs, ['noOutField']);

        expect(phoneObject.attrs).not.toBe(phoneAttrs);
        expect(phoneObject.attrs).toStrictEqual(phoneAttrs);
      });

      test('получили тот же объект attrs что передали', () => {
        const phoneAttrs = dtoUtility.deepCopy(DODF.phoneAttrs);
        const phoneObject = sut.getValueObject<DODF.PhoneDOD>('Phone', phoneAttrs, ['noOutField'], false);

        expect(phoneObject.attrs).toBe(phoneAttrs);
        expect(phoneObject.attrs).toStrictEqual(phoneAttrs);
      });

      test('получили ожидаемую метаинформацию', () => {
        const phoneAttrs = dtoUtility.deepCopy(DODF.phoneAttrs);
        const phoneObj = sut.getValueObject<DODF.PhoneDOD>('Phone', phoneAttrs, ['noOutField']);

        const expectedMeta: DODF.PhoneMeta = {
          name: 'Phone',
          objectType: 'value-object',
          domainType: 'object',
          noOutputAttrs: ['noOutField'],
        };
        expect(phoneObj.meta).toStrictEqual(expectedMeta);
      });
    });

    describe('получение DOD модели чтения', () => {
      test('получили копию объекта attrs', () => {
        const productAttrs = dtoUtility.deepCopy(DODF.productAttrs);
        const productReadModel = sut.getReadModel<DODF.ProductDOD>('Product', productAttrs);

        expect(productReadModel.attrs).not.toBe(productAttrs);
        expect(productReadModel.attrs).toStrictEqual(productAttrs);
      });

      test('получили тот же объект attrs что передали', () => {
        const productAttrs = dtoUtility.deepCopy(DODF.productAttrs);
        const productReadModel = sut.getReadModel<DODF.ProductDOD>('Product', productAttrs, false);

        expect(productReadModel.attrs).toBe(productAttrs);
        expect(productReadModel.attrs).toStrictEqual(productAttrs);
      });

      test('получили ожидаемую метаинформацию', () => {
        const productAttrs = dtoUtility.deepCopy(DODF.productAttrs);
        const productReadModel = sut.getReadModel<DODF.ProductDOD>('Product', productAttrs);

        const expectedMeta: DODF.ProductMeta = {
          name: 'Product',
          objectType: 'read-model',
          domainType: 'object',
          noOutputAttrs: [],
        };
        expect(productReadModel.meta).toStrictEqual(expectedMeta);
      });
    });

    describe('получение DOD объекта события', () => {
      test('получили копию объекта attrs', () => {
        const phoneAddedEventAttrs = {
          eventID: UUIDUtility.getNewUUIDValue(),
          ...dtoUtility.deepCopy(DODF.phoneAttrs),
        };
        const phoneAddedEvent = sut.getEvent<
          DODF.PhoneAddedEventDOD
        >('PhoneAddedEvent', 'Phone', phoneAddedEventAttrs, []);

        expect(phoneAddedEvent.attrs).not.toBe(phoneAddedEventAttrs);
        expect(phoneAddedEvent.attrs).toStrictEqual(phoneAddedEventAttrs);
      });

      test('получили тот же объект attrs что передали', () => {
        const phoneAddedEventAttrs = {
          eventID: UUIDUtility.getNewUUIDValue(),
          ...dtoUtility.deepCopy(DODF.phoneAttrs),
        };
        const phoneAddedEvent = sut.getEvent<
          DODF.PhoneAddedEventDOD
        >('PhoneAddedEvent', 'Phone', phoneAddedEventAttrs, [], false);

        expect(phoneAddedEvent.attrs).toBe(phoneAddedEventAttrs);
        expect(phoneAddedEvent.attrs).toStrictEqual(phoneAddedEventAttrs);
      });

      test('получили ожидаемую метаинформацию', () => {
        const phoneAddedEventAttrs = {
          eventID: UUIDUtility.getNewUUIDValue(),
          ...dtoUtility.deepCopy(DODF.phoneAttrs),
        };
        const phoneAddedEvent = sut.getEvent<
          DODF.PhoneAddedEventDOD
        >('PhoneAddedEvent', 'Phone', phoneAddedEventAttrs, []);

        const expectedMeta: GetDODMeta<DODF.PhoneAddedEventDOD> = {
          name: 'PhoneAddedEvent',
          group: 'Phone',
          objectType: 'value-object',
          domainType: 'event',
          noOutputAttrs: [],
        };
        expect(phoneAddedEvent.meta).toStrictEqual(expectedMeta);
      });
    });

    describe('получение DOD ошибки уровня приложения', () => {
      test('получили копию объекта attrs', () => {
        const errAttrs = { traceback: 'any object' } as const;
        const appError = sut.getAppError<DODF.InternalAppError>('InternalError', errAttrs);

        expect(appError.attrs).not.toBe(errAttrs);
        expect(appError.attrs).toStrictEqual(errAttrs);
      });

      test('получили тот же объект attrs что передали', () => {
        const errAttrs = { traceback: 'any object' } as const;
        const appError = sut.getAppError<
          DODF.InternalAppError
        >('InternalError', errAttrs, false);

        expect(appError.attrs).toBe(errAttrs);
        expect(appError.attrs).toStrictEqual(errAttrs);
      });

      test('получили ожидаемую метаинформацию', () => {
        const errAttrs = { traceback: 'any object' } as const;
        const appError = sut.getAppError<DODF.InternalAppError>('InternalError', errAttrs);

        const expectedMeta: GetDODMeta<DODF.InternalAppError> = {
          name: 'InternalError',
          objectType: 'value-object',
          domainType: 'error',
          errorType: 'app-error',
          noOutputAttrs: [],
        };
        expect(appError.meta).toStrictEqual(expectedMeta);
      });
    });

    describe('получение DOD доменной ошибки', () => {
      test('получили копию объекта attrs', () => {
        const errAttrs = { personID: 5 };
        const domainError = sut
          .getDomainError<DODF.PersonNotFoundDomainError>('PersonNotFoundError', errAttrs);

        expect(domainError.attrs).not.toBe(errAttrs);
        expect(domainError.attrs).toStrictEqual(errAttrs);
      });

      test('получили тот же объект attrs что передали', () => {
        const errAttrs = { personID: 5 };
        const domainError = sut
          .getDomainError<DODF.PersonNotFoundDomainError>('PersonNotFoundError', errAttrs, false);

        expect(domainError.attrs).toBe(errAttrs);
        expect(domainError.attrs).toStrictEqual(errAttrs);
      });

      test('получили ожидаемую метаинформацию', () => {
        const errAttrs = { personID: 5 };
        const domainError = sut
          .getDomainError<DODF.PersonNotFoundDomainError>('PersonNotFoundError', errAttrs);

        const expectedMeta: GetDODMeta<DODF.PersonNotFoundDomainError> = {
          name: 'PersonNotFoundError',
          objectType: 'value-object',
          domainType: 'error',
          errorType: 'domain-error',
          noOutputAttrs: [],
        };
        expect(domainError.meta).toStrictEqual(expectedMeta);
      });
    });
  });

  describe('Метод isError', () => {
    test('Доменная ошибка является ошибкой', () => {
      const domainError = sut.getDomainError('Any', {});
      const result = sut.isError(domainError);
      expect(result).toBeTruthy();
    });

    test('Ошибка приложения является ошибкой', () => {
      const appError = sut.getAppError('Any', {});
      const result = sut.isError(appError);
      expect(result).toBeTruthy();
    });

    test('Просто объект не является ошибкой', () => {
      const someObject = { isPerson: true };
      const result = sut.isError(someObject);
      expect(result).toBeFalsy();
    });

    test('DOD-не ошибка - не является ошибкой', () => {
      const eventDOD = sut.getEvent('Any', 'Any', { eventID: UUIDUtility.getNewUUIDValue() }, []);
      const result = sut.isError(eventDOD);
      expect(result).toBeFalsy();
    });
  });

  test('Успешное получение Output агрегата', () => {
    const outPersonDOD = sut.getOutputAggregate<DODF.OutputPerson>(
      'Person',
      DODF.personOutputAttrs,
      ['birthday'],
    );

    expect(Object.keys(outPersonDOD.attrs).includes('birthday')).toBeFalsy();
    expect(Object.keys(outPersonDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outPersonDOD.meta.output).toBe(true);
    expect((outPersonDOD.meta as unknown as { version: AggregateVersion }).version).toBe(undefined);
    expect(outPersonDOD.attrs.id).toBe(DODF.personOutputAttrs.id);
    expect(outPersonDOD.attrs.name).toBe(DODF.personOutputAttrs.name);
    expect(outPersonDOD.attrs.lastName).toBe(DODF.personOutputAttrs.lastName);

    const outContactsDOD = outPersonDOD.attrs.contacts;
    expect(Object.keys(outContactsDOD.attrs).includes('noOutField')).toBeFalsy();
    expect(Object.keys(outContactsDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outContactsDOD.meta.output).toBe(true);

    const outPhoneDODs = outContactsDOD.attrs.phones;
    expect(Array.isArray(outPhoneDODs)).toBeTruthy();
    const outPhoneDOD = outPhoneDODs[0];
    expect(Object.keys(outPhoneDOD.attrs).includes('noOutField')).toBeFalsy();
    expect(Object.keys(outPhoneDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outPhoneDOD.meta.output).toBe(true);
    expect(outPhoneDOD.attrs.number).toBeDefined();

    const outEmailDOD = outContactsDOD.attrs.email;
    expect(Object.keys(outEmailDOD.attrs).includes('noOutField')).toBeFalsy();
    expect(Object.keys(outEmailDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outEmailDOD.meta.output).toBe(true);
    expect(outEmailDOD.attrs.value).toBeDefined();
  });

  test('Успешное получение Output сущности', () => {
    const outPersonEntityDOD = sut.getOutputEntity<DODF.OutputPersonEntityDOD>(
      'PersonEntity',
      DODF.personEntityOutputAttrs,
      [],
    );

    expect(Object.keys(outPersonEntityDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outPersonEntityDOD.meta.output).toBe(true);
    expect(outPersonEntityDOD.attrs.id).toBe(DODF.personEntityOutputAttrs.id);
    expect(outPersonEntityDOD.attrs.name).toBe(DODF.personEntityOutputAttrs.name);
    expect(outPersonEntityDOD.attrs.lastName).toBe(DODF.personEntityOutputAttrs.lastName);
    expect(outPersonEntityDOD.attrs.birthday).toBe(DODF.personEntityOutputAttrs.birthday);

    const outContactsDOD = outPersonEntityDOD.attrs.contacts;
    expect(Object.keys(outContactsDOD.attrs).includes('noOutField')).toBeFalsy();
    expect(Object.keys(outContactsDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outContactsDOD.meta.output).toBe(true);

    const outPhoneDODs = outContactsDOD.attrs.phones;
    expect(Array.isArray(outPhoneDODs)).toBeTruthy();
    const outPhoneDOD = outPhoneDODs[0];
    expect(Object.keys(outPhoneDOD.attrs).includes('noOutField')).toBeFalsy();
    expect(Object.keys(outPhoneDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outPhoneDOD.meta.output).toBe(true);
    expect(outPhoneDOD.attrs.number).toBeDefined();

    const outEmailDOD = outContactsDOD.attrs.email;
    expect(Object.keys(outEmailDOD.attrs).includes('noOutField')).toBeFalsy();
    expect(Object.keys(outEmailDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outEmailDOD.meta.output).toBe(true);
    expect(outEmailDOD.attrs.value).toBeDefined();
  });

  test('Успешное получение Output объекта-значения', () => {
    const outEmailDOD = sut.getOutputValueObject<DODF.OutputEmailDOD>(
      'Email',
      DODF.emailOutputAttrs,
      ['noOutField'],
    );

    expect(Object.keys(outEmailDOD.attrs).includes('noOutField')).toBeFalsy();
    expect(Object.keys(outEmailDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outEmailDOD.meta.output).toBe(true);
    expect(outEmailDOD.attrs.value).toBeDefined();
  });

  test('Успешное получение Output события', () => {
    const outPhoneAddedEventDOD = sut.getOutputEvent<DODF.PhoneAddedOutputEventDOD>(
      'PhoneAddedEvent',
      'Phone',
      DODF.phoneAddedEventOutputAttrs,
      [],
    );

    expect(outPhoneAddedEventDOD.attrs.noOutField).toBeDefined();
    expect(Object.keys(outPhoneAddedEventDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outPhoneAddedEventDOD.meta.output).toBe(true);
    expect(outPhoneAddedEventDOD.attrs.number).toBeDefined();
  });

  test('Успешное получение Output доменной ошибки', () => {
    const outPersonNotFoundErrorDOD = sut
      .getOutputDomainError<DODF.PersonNotFoundOutputDomainError>(
        'PersonNotFoundError',
        DODF.personNotFoundOutputAttrs,
      );

    expect(outPersonNotFoundErrorDOD.attrs.personID).toBeDefined();
    expect(Object.keys(outPersonNotFoundErrorDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outPersonNotFoundErrorDOD.meta.output).toBe(true);
  });

  test('Успешное получение Output ошибки приложения', () => {
    const outInternalAppErrorDOD = sut.getOutputAppError<DODF.InternalOutputAppError>(
      'InternalError',
      DODF.internalErrorOutputAttrs,
    );

    expect(outInternalAppErrorDOD.attrs.traceback).toBeDefined();
    expect(Object.keys(outInternalAppErrorDOD.meta).includes('noOutputAttrs')).toBeFalsy();
    expect(outInternalAppErrorDOD.meta.output).toBe(true);
  });

  test('Успешное получение Output: noOut атрибуты отсекаются', () => {
    const personAttrs = {
      ...DODF.personAttrs,
      contacts: DODF.personContactsOutputDOD,
    };
    expect(Object.keys(personAttrs).includes('birthday')).toBeTruthy();
    const outPersonDOD = sut.getOutputAggregate<DODF.OutputPerson>(
      'Person',
      personAttrs,
      ['birthday'],
    );
    expect(Object.keys(outPersonDOD.attrs).includes('birthday')).toBeFalsy();
  });
});
