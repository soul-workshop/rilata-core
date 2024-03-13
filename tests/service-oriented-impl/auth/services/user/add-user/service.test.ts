import {
  beforeEach, describe, expect, spyOn, test,
} from 'bun:test';
import { DeliveryEvent } from '../../../../../../src/app/bus/types';
import { EventRepository } from '../../../../../../src/app/database/event-repository';
import { TestDatabase } from '../../../../../../src/app/database/test-database';
import { dodUtility } from '../../../../../../src/common/utils/domain-object/dod-utility';
import { uuidUtility } from '../../../../../../src/common/utils/uuid/uuid-utility';
import { setAndGetTestStoreDispatcher } from '../../../../../fixtures/test-thread-store-mock';
import { ServiceModulesFixtures } from '../../../../zzz-run-server/server-fixtures';
import { UserRepository } from '../../../domain-object/user/repo';
import { AuthModule } from '../../../module';
import { AddUserRequestDod, AddUserOut } from './s-params';
import { AddingUserService } from './service';

describe('add user service tests', async () => {
  const requestId = 'c22fd027-a94b-4728-90eb-f6d4f96992c2';
  const testSever = await ServiceModulesFixtures.getServer<AuthModule>(['AuthModule']);
  const module = testSever.getModule<AuthModule>('AuthModule');
  const resolver = module.getModuleResolver();
  const store = setAndGetTestStoreDispatcher({
    requestId,
    moduleResolver: resolver,
  }).getStoreOrExepction();

  beforeEach(async () => {
    const db = resolver.getDatabase() as TestDatabase;
    await db.clear();
    await db.addBatch(ServiceModulesFixtures.repoFixtures);
  });

  test('успех, пользователь добавлен', async () => {
    const inputDod = dodUtility.getRequestDod<AddUserRequestDod>(
      'addUser',
      { personIin: '111333555777' },
      requestId,
    );
    const sut = module.getServiceByName<AddingUserService>('addUser');
    const result = await sut.execute(inputDod);
    expect(result.isSuccess()).toBe(true);
    const userAr = result.value as AddUserOut;
    expect(uuidUtility.isValidValue(userAr.userId)).toBe(true);

    const eventRepo = EventRepository.instance(resolver);
    const events = await eventRepo.getNotPublished();
    expect(events.length).toBe(1);
    const eventId = events[0].busMessageId;
    const event = await eventRepo.getBusMessage(eventId);
    expect(event?.aRoot.attrs.userId).toBe(userAr.userId);
  });

  test('успех, пользователь с таким id существует и service перезапустился', async () => {
    const inputDod = dodUtility.getRequestDod<AddUserRequestDod>(
      'addUser',
      { personIin: '111333555777' },
      requestId,
    );
    let mockCallCount = 0;
    const randomUuidMock = spyOn(uuidUtility, 'getNewUUID').mockImplementation(() => {
      mockCallCount += 1;
      return mockCallCount === 2
        ? 'edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd' // second call generate new userId
        : crypto.randomUUID(); // first callgenerate transactionId and other calls
    });

    const repoAddUserMock = spyOn(UserRepository.instance(resolver), 'addUser');
    randomUuidMock.mockClear();
    const sut = module.getServiceByName<AddingUserService>('addUser');
    const result = await sut.execute(inputDod);

    expect(result.isSuccess()).toBe(true);
    const userAr = result.value as AddUserOut;

    const eventRepo = EventRepository.instance(resolver);
    const events = await eventRepo.getNotPublished();
    expect(events.length).toBe(1);
    const eventId = events[0].busMessageId;
    const event = await eventRepo.getBusMessage(eventId);
    expect(event?.aRoot.attrs.userId).toBe(userAr.userId);

    // reexecute service by DatabaseObjectSavingError exception
    expect(repoAddUserMock).toHaveBeenCalledTimes(2);
    expect(repoAddUserMock.mock.calls[0][0].userId).toBe('edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd');
  });
});
