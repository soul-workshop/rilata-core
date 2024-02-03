import {
  describe, test, expect, mock,
} from 'bun:test';
import { uuidUtility } from '../../../src/common/utils/uuid/uuid-utility';
import { EventDod, GeneralEventDod } from '../../../src/domain/domain-data/domain-types';
import { OneServerBus } from '../../../src/infra/bus/one-server-bus';
import { BusEventPublish, BusEventSubscribe } from '../../../src/app/bus/types';

describe('one server bus tests', () => {
  const sut = new OneServerBus();

  const eventDod: EventDod<{ name: string, old: number }, 'userAdded'> = {
    attrs: {
      name: 'Nick',
      old: 24,
    },
    meta: {
      eventId: '',
      actionId: '',
      name: 'userAdded',
      moduleName: 'subject',
      domainType: 'event',
    },
    caller: {
      type: 'DomainUser',
      userId: uuidUtility.getNewUUID(),
    },
    aRootAttrs: {
      attrs: {
        name: 'Nick',
        old: 24,
      },
      meta: {
        name: 'UserAR',
        domainType: 'aggregate',
        version: 0,
      },
    },
  };

  const eventAsJson = JSON.stringify(eventDod);

  const eventSubscribe: BusEventSubscribe = {
    moduleName: 'subject',
    eventName: 'userAdded',
  };

  const eventPublish: BusEventPublish = {
    moduleName: 'subject',
    eventName: 'userAdded',
    event: eventAsJson,
  };

  test('подписка и получение события', async () => {
    const handlerMock = mock(async (event: GeneralEventDod): Promise<void> => {
      expect(event.meta.moduleName).toBe('subject');
      expect(event.meta.name).toBe('userAdded');
    });
    await sut.subscribe(eventSubscribe, handlerMock);
    sut.publish(eventPublish);
    expect(handlerMock).toHaveBeenCalledTimes(1);
  });

  test('публикация, но обработчика на это событие нет', async () => {
    const handlerMock = mock(async (event: GeneralEventDod): Promise<void> => {
      expect(event.meta.moduleName).toBe('subject');
      expect(event.meta.name).toBe('userAdded');
    });
    const notSubscribedEvent: BusEventPublish = {
      moduleName: 'subject',
      eventName: 'userNameChanged',
      event: 'any event as json',
    };
    await sut.subscribe(eventSubscribe, handlerMock);
    sut.publish(notSubscribedEvent);
    expect(handlerMock).toHaveBeenCalledTimes(0);
  });
});

