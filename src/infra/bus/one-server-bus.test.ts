import {
  describe, test, expect, mock,
} from 'bun:test';
import { uuidUtility } from '../../../src/common/utils/uuid/uuid-utility';
import {
  ARDT, DomainMeta, EventDod, GeneralEventDod,
} from '../../../src/domain/domain-data/domain-types';
import { OneServerBus } from '../../../src/infra/bus/one-server-bus';
import { PublishedEvent, SubscribeToEvent } from '../../../src/app/bus/types';
import { dodUtility } from '../../../src/common/utils/domain-object/dod-utility';
import { UuidType } from '../../../src/common/types';
import { GeneralModuleResolver } from '../../../src/app/module/types';
import { setAndGetTestStoreDispatcher } from '../../../tests/fixtures/test-thread-store-mock';

describe('one server bus tests', () => {
  const sut = new OneServerBus();
  setAndGetTestStoreDispatcher({
    moduleResolver: {
      getModule: () => ({
        moduleName: 'subject-cmd-module',
      }),
    } as GeneralModuleResolver,
  });

  type UserAttrs = { name: string, old: number };
  type UserAdded = EventDod<UserAttrs, 'UserAddedEvent', ARDT<UserAttrs, DomainMeta<'UserAR'>>>;

  const attrs: UserAttrs = {
    name: 'Nick',
    old: 24,
  };
  const aRootAttrs: ARDT<UserAttrs & { id: UuidType }, DomainMeta<'UserAR'>> = {
    attrs: {
      id: uuidUtility.getNewUUID(),
      name: 'Nick',
      old: 24,
    },
    meta: {
      name: 'UserAR',
      domainType: 'aggregate',
      version: 0,
    },
  };
  const eventDod = dodUtility.getEvent<UserAdded>('UserAddedEvent', attrs, aRootAttrs);

  const eventAsJson = JSON.stringify(eventDod);

  const eventSubscribe: SubscribeToEvent = {
    moduleName: 'subject',
    eventName: 'UserAddedEvent',
  };

  const eventPublish: PublishedEvent = {
    moduleName: 'subject',
    eventName: 'UserAddedEvent',
    event: eventAsJson,
    aRootId: aRootAttrs.attrs.id,
  };

  test('подписка и получение события', async () => {
    const handlerMock = mock(async (event: GeneralEventDod): Promise<void> => {
      expect(event.meta.moduleName).toBe('subject-cmd-module');
      expect(event.meta.name).toBe('UserAddedEvent');
    });
    await sut.subscribe(eventSubscribe, handlerMock);
    sut.publish(eventPublish);
    expect(handlerMock).toHaveBeenCalledTimes(1);
  });

  test('публикация, но обработчика на это событие нет', async () => {
    const handlerMock = mock(async (event: GeneralEventDod): Promise<void> => {
      throw Error('invalid call');
    });
    const notSubscribedEvent: PublishedEvent = {
      moduleName: 'subject-cmd-module',
      eventName: 'userNameChanged',
      event: 'any event as json',
      aRootId: uuidUtility.getNewUUID(),
    };
    await sut.subscribe(eventSubscribe, handlerMock);
    sut.publish(notSubscribedEvent);
    expect(handlerMock).toHaveBeenCalledTimes(0);
  });
});
