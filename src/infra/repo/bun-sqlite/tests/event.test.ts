import { beforeEach, describe, expect, spyOn, test } from 'bun:test';
import { DeliveryEvent } from '../../../../app/bus/types';
import { GetDtoKeysByDotNotation } from '../../../../common/type-functions';
import { dtoUtility } from '../../../../common/utils/dto/dto-utility';
import { GeneralEventDod } from '../../../../domain/domain-data/domain-types';
import { SqliteEventRepository } from '../repositories/event';
import { SqliteTestFixtures } from './fixtures';

describe('bun sql event repository tests', () => {
  const db = new SqliteTestFixtures.BlogDatabase();
  const { resolver } = SqliteTestFixtures;
  db.init(resolver); // init and resolves db and repositories
  db.createDb(); // create sqlite db and tables
  db.open(); // open sqlite db
  const sut = db.getRepository<SqliteEventRepository>('events');

  beforeEach(async () => {
    await db.clear();
  });

  describe('add events tests', () => {
    test('успех, события добавлены', async () => {
      await sut.addEvents(SqliteTestFixtures.events);

      const notPublishedDeliveries = await sut.getNotPublished();
      expect(notPublishedDeliveries.length).toBe(2);
      expect(notPublishedDeliveries).toEqual([
        {
          id: '35c226f6-a150-4987-9b15-1ed3f52f90fa',
          name: 'addUser',
          payload: JSON.stringify(SqliteTestFixtures.events[0]),
          requestId: '7300da3b-545c-492c-b31b-213c02620ed5',
          isPublished: 0,
          aRootName: 'UserAr',
          aRootId: 'e4aaf44c-f727-4b00-b9e1-fcba0feb98c0',
          type: 'event',
        },
        {
          id: 'de63b084-e565-4090-8972-225f36cd6c2b',
          name: 'userProfileCreated',
          payload: JSON.stringify(SqliteTestFixtures.events[1]),
          isPublished: 0,
          requestId: '7300da3b-545c-492c-b31b-213c02620ed5',
          aRootName: 'UserAr',
          aRootId: 'e4aaf44c-f727-4b00-b9e1-fcba0feb98c0',
          type: 'event',
        },
      ]);
    });

    test('провал, тест транзакции, ошибка в одном из событий приводит к отмене всех, ', async () => {
      const failEvent = dtoUtility.deepCopy(SqliteTestFixtures.events[1]);
      failEvent.aRoot.meta.name = (undefined as unknown as string);
      const failEvents = [
        SqliteTestFixtures.events[0],
        failEvent,
      ];
      try {
        await sut.addEvents(failEvents);
        throw Error('not be called');
      // eslint-disable-next-line keyword-spacing, no-empty
      } catch(e) {
        expect(String(e)).toContain('constraint failed');
      }

      const notPublishedDeliveries = await sut.getNotPublished();
      expect(notPublishedDeliveries.length).toBe(0);
    });

    test('успех, вызов добавления событий с пустым списком не приводит к изменениям', async () => {
      await sut.addEvents([]);

      const notPublishedDeliveries = await sut.getNotPublished();
      expect(notPublishedDeliveries.length).toBe(0);
    });
  });

  describe('event repo constraint tests', () => {
    test('провал, тестируем случаи когда поля со значением null не допустимы', () => {
      const event = SqliteTestFixtures.events[0];
      const notNullableFields: GetDtoKeysByDotNotation<typeof event>[] = [
        'meta.eventId',
        'meta.name',
        'meta.requestId',
        'aRoot.meta.name',
        'aRoot.meta.idName',
      ];
      const addEventsSpy = spyOn(sut, 'addEvents');
      notNullableFields.forEach(async (fldName) => {
        const addEvent = dtoUtility.excludeDeepAttrs(event, fldName) as GeneralEventDod;
        try {
          await sut.addEvents([addEvent]);
          throw Error(`not be called, fieldName: ${fldName}`);
        } catch (e) {
          expect(String(e)).toBe('Error: constraint failed');
        }
      });
      expect(addEventsSpy).toHaveBeenCalledTimes(5);
    });
  });

  describe('get not published events', () => {
    const event1 = SqliteTestFixtures.events[0];
    const event2 = SqliteTestFixtures.events[1];

    function getDeliveryEvent(event: GeneralEventDod): DeliveryEvent {
      return {
        id: event.meta.eventId,
        name: event.meta.name,
        payload: JSON.stringify(event),
        requestId: event.meta.requestId,
        isPublished: 0,
        aRootName: event.aRoot.meta.name,
        aRootId: event.aRoot.attrs[event.aRoot.meta.idName],
        type: 'event',
      };
    }

    test('успех, возвращаются несколько не опубликованных событий', async () => {
      await sut.addEvents(SqliteTestFixtures.events);
      const result = await sut.getNotPublished();
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(getDeliveryEvent(event1));
      expect(result[1]).toEqual(getDeliveryEvent(event2));
    });

    test('успех, возвращается одно событие', async () => {
      await sut.addEvents(SqliteTestFixtures.events);
      expect(await sut.markAsPublished(event2.meta.eventId)).toEqual({ count: 1 });
      const result = await sut.getNotPublished();
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(getDeliveryEvent(event1));
    });

    test('успех, не опубликованных событий нет', async () => {
      await sut.addEvents(SqliteTestFixtures.events);
      expect(await sut.markAsPublished(event1.meta.eventId)).toEqual({ count: 1 });
      expect(await sut.markAsPublished(event2.meta.eventId)).toEqual({ count: 1 });
      const result = await sut.getNotPublished();
      expect(result.length).toBe(0);
    });
  });

  describe('mark event as published tests', () => {
    const { events } = SqliteTestFixtures;

    test('успех, событие промаркировано как опубликованное', async () => {
      await sut.addEvents(SqliteTestFixtures.events);
      expect((await sut.getNotPublished()).length).toBe(2);

      const markEventId = events[0].meta.eventId;
      const result = await sut.markAsPublished(markEventId);
      expect(result.count).toBe(1);

      const notPublishedEvents = await sut.getNotPublished();
      expect(notPublishedEvents.length).toBe(1);
      const notMarkedEventId = events[1].meta.eventId;
      expect(notPublishedEvents[0].id).toBe(notMarkedEventId);
    });

    test('успех, все события промаркированы как опубликованные', async () => {
      await sut.addEvents(SqliteTestFixtures.events);
      const notPublishedEvents = await sut.getNotPublished();
      expect(notPublishedEvents.length).toBe(2);

      await sut.markAsPublished(notPublishedEvents[0].id);
      await sut.markAsPublished(notPublishedEvents[1].id);

      const emptyEvents = await sut.getNotPublished();
      expect(emptyEvents.length).toBe(0);
    });

    test('если id события нет, то это игнорируется', async () => {
      await sut.addEvents(SqliteTestFixtures.events);
      const notPublishedEvents = await sut.getNotPublished();
      expect(notPublishedEvents.length).toBe(2);

      await Promise.all(notPublishedEvents.map(async (deliveryEvent) => {
        await sut.markAsPublished(deliveryEvent.id);
      }));

      const emptyEvents = await sut.getNotPublished();
      expect(emptyEvents.length).toBe(0);
    });

    test('повторная маркировка как опубликованное не приводит к изменениям', async () => {
      await sut.addEvents(SqliteTestFixtures.events);
      const notPublishedEvents = await sut.getNotPublished();
      expect(notPublishedEvents.length).toBe(2);

      expect(await sut.markAsPublished(notPublishedEvents[0].id)).toEqual({ count: 1 });
      expect(await sut.markAsPublished(notPublishedEvents[1].id)).toEqual({ count: 1 });
      const emptyEvents = await sut.getNotPublished();
      expect(emptyEvents.length).toBe(0);

      // повторно...
      expect(await sut.markAsPublished(notPublishedEvents[0].id)).toEqual({ count: 1 });
      expect(await sut.markAsPublished(notPublishedEvents[1].id)).toEqual({ count: 1 });
    });
  });

  describe('finding event tests', () => {
    async function checkEvents(isExist: boolean): Promise<void> {
      const res1 = await sut.findEvent(SqliteTestFixtures.events[0].meta.eventId);
      const res2 = await sut.findEvent(SqliteTestFixtures.events[1].meta.eventId);
      if (isExist) {
        expect(res1).not.toBeUndefined();
        expect(res1).toEqual(SqliteTestFixtures.events[0]);
        expect(res2).not.toBeUndefined();
        expect(res2).toEqual(SqliteTestFixtures.events[1]);
      } else {
        expect(res1).toBeUndefined();
        expect(res2).toBeUndefined();
      }
    }

    test('случай когда возвращается событие', async () => {
      await checkEvents(false); // проверяем до, события есть
      await sut.addEvents(SqliteTestFixtures.events);
      await checkEvents(true); // проверяем после, событий нет
    });

    test('случай, когда событий нет', async () => {
      await checkEvents(false); // событий нет
    });
  });

  describe('event is exist tests', () => {
    const eventId1 = SqliteTestFixtures.events[0].meta.eventId;
    const eventId2 = SqliteTestFixtures.events[1].meta.eventId;

    test('случай когда событие есть, возвращается истина', async () => {
      await sut.addEvents(SqliteTestFixtures.events);

      expect(await sut.isExist(eventId1)).toBe(true);
      expect(await sut.isExist(eventId2)).toBe(true);
    });

    test('случай когда события нет, возвращается ложь', async () => {
      expect(await sut.isExist(eventId1)).toBe(false);
      expect(await sut.isExist(eventId2)).toBe(false);
    });
  });
});
