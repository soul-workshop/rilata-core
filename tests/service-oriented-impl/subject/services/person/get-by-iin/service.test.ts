import {
  beforeEach, describe, expect, test,
} from 'bun:test';
import { setAndGetTestStoreDispatcher } from '../../../../../fixtures/test-thread-store-mock';
import { TestDatabase } from '../../../../../../src/app/database/test-database';
import { ServiceModulesFixtures } from '../../../../zzz-run-server/server-fixtures';
import { SubjectModule } from '../../../module';
import { dodUtility } from '../../../../../../src/common/utils/domain-object/dod-utility';
import { GetPersonByIinRequestDod, GetPersonByIinOut } from './s-params';
import { GetingPersonByIinService } from './service';
import { PersonDoesntExistByIinError } from '../../../domain-object/person/repo-errors';

describe('get person by iin service tests', async () => {
  const requestId = 'c22fd027-a94b-4728-90eb-f6d4f96992c2';
  const testSever = await ServiceModulesFixtures.getServer('all');
  const module = testSever.getModule<SubjectModule>('SubjectModule');
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

  test('успех, возвращен экз. персоны', async () => {
    const validRequestDod = dodUtility.getRequestDod<GetPersonByIinRequestDod>(
      'getPersonByIin',
      { iin: '123123123123' },
      requestId,
    );

    const sut = module.getServiceByName<GetingPersonByIinService>('getPersonByIin');
    const result = await sut.execute(validRequestDod);
    expect(result.isSuccess()).toBe(true);
    const person = result.value as GetPersonByIinOut;
    expect(person).toEqual({
      id: 'b433034e-8090-4c7d-8738-8cb78bbc6792',
      firstName: 'Bill',
      lastName: 'Geits',
      iin: '123123123123',
      contacts: {
        emails: [{ type: 'corporate', email: 'bill@microsoft.com' }],
        // not exported techSupportComments attribute
      },
    });
  });

  test('провал, персона с таким ИИН не найдена', async () => {
    const validRequestDod = dodUtility.getRequestDod<GetPersonByIinRequestDod>(
      'getPersonByIin',
      { iin: '111222111222' },
      requestId,
    );

    const sut = module.getServiceByName<GetingPersonByIinService>('getPersonByIin');
    const result = await sut.execute(validRequestDod);
    expect(result.isFailure()).toBe(true);
    const person = result.value as PersonDoesntExistByIinError;
    expect(person).toEqual({
      locale: {
        name: 'PersonDoesntExistByIinError',
        text: 'Не найден человек с ИИН: {{iin}}',
        hint: {
          iin: '111222111222',
        },
      },
      name: 'PersonDoesntExistByIinError',
      meta: {
        domainType: 'error',
        errorType: 'domain-error',
      },
    });
  });
});
