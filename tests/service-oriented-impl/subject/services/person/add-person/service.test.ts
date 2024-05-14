import {
  beforeEach, describe, expect, test,
} from 'bun:test';
import { dodUtility } from '../../../../../../src/common/utils/domain-object/dod-utility';
import { uuidUtility } from '../../../../../../src/common/utils/uuid/uuid-utility';
import { setAndGetTestStoreDispatcher } from '../../../../../fixtures/test-thread-store-mock';
import { serverStarter } from '../../../../zzz-run-server/starter';
import { ServiceModulesFixtures } from '../../../../zzz-run-server/server-fixtures';
import { PersonAR } from '../../../domain-object/person/a-root';
import { PersonRepository } from '../../../domain-object/person/repo';
import { PersonAlreadyExistsError } from '../../../domain-object/person/repo-errors';
import { SubjectModule } from '../../../module';
import { AddPersonRequestDod, AddPersonOut } from './s-params';
import { AddingPersonService } from './service';
import { TestDatabase } from '../../../../../../src/app/database/test.database';
import { EventRepository } from '../../../../../../src/app/database/event.repository';

describe('add person service tests', async () => {
  const requestId = 'c22fd027-a94b-4728-90eb-f6d4f96992c2';
  const testSever = serverStarter.start('all');
  const module = testSever.getModule<SubjectModule>('SubjectModule');
  const resolver = module.getModuleResolver();
  setAndGetTestStoreDispatcher({
    requestId,
    moduleResolver: resolver,
  }).getStoreOrExepction();

  beforeEach(async () => {
    const db = resolver.getDatabase() as unknown as TestDatabase<true>;
    await db.clear();
    await db.addBatch(ServiceModulesFixtures.repoFixtures);
  });

  test('успех, новая персона добавился', async () => {
    const validRequestDod = dodUtility.getRequestDod<AddPersonRequestDod>(
      'addPerson',
      { iin: '123456789012', lastName: 'Lorawel', firstName: 'Paul' },
      requestId,
    );

    const sut = module.getServiceByInputDodName<AddingPersonService>('addPerson');
    const result = await sut.execute(validRequestDod);
    expect(result.isSuccess()).toBe(true);
    const value = result.value as AddPersonOut;
    expect(uuidUtility.isValidValue(value.id)).toBe(true);

    const personRepo = PersonRepository.instance(resolver);
    const getResult = await personRepo.getById(value.id);
    expect(getResult.isSuccess()).toBe(true);
    expect(getResult.value).toBeInstanceOf(PersonAR);
    const eventRepo = EventRepository.instance(resolver);
    const events = await eventRepo.getAggregateEvents(value.id);
    expect(events.length).toBe(1);
    expect(events[0].meta.name).toBe('PersonAddedEvent');
  });

  test('провал, человек с таким ИИН уже существует', async () => {
    const existPersonRequestDod = dodUtility.getRequestDod<AddPersonRequestDod>(
      'addPerson',
      { iin: '123123123123', lastName: 'Bill', firstName: 'Bill' },
      requestId,
    );

    const sut = module.getServiceByInputDodName<AddingPersonService>('addPerson');
    const result = await sut.execute(existPersonRequestDod);
    expect(result.isFailure()).toBe(true);
    const err = result.value as PersonAlreadyExistsError;
    expect(err).toEqual({
      locale: {
        text: 'Человек с данным ИИН уже существует в системе',
        hint: { iin: '123123123123' },
        name: 'PersonAlreadyExistsError',
      },
      name: 'PersonAlreadyExistsError',
      meta: {
        domainType: 'error',
        errorType: 'domain-error',
      },
    });
  });
});
