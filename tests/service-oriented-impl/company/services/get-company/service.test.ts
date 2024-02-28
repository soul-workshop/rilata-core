import {
  describe, test, expect, beforeEach,
} from 'bun:test';
import { TestDatabase } from '../../../../../src/app/database/test-database';
import { dodUtility } from '../../../../../src/common/utils/domain-object/dod-utility';
import { setAndGetTestStoreDispatcher } from '../../../../fixtures/test-thread-store-mock';
import { ServiceModulesFixtures } from '../../../zzz-run-server/server-fixtures';
import { CompanyAttrs } from '../../domain-data/company/params';
import { CompanyDoesntExistByIdError } from '../../domain-object/company/repo-errors';
import { CompanyModule } from '../../module';
import { GetCompanyRequestDod } from './s.params';
import { GetingCompanyService } from './service';

describe('register company saga service tests', async () => {
  const requestId = '5611f332-f4d9-4c16-a561-04dabe864fc9';
  const testServer = await ServiceModulesFixtures.getServer('all');
  const module = testServer.getModule<CompanyModule>('CompanyModule');
  const resolver = module.getModuleResolver();
  const store = setAndGetTestStoreDispatcher({
    requestId,
    moduleResolver: resolver,
  });

  beforeEach(() => {
    const db = resolver.getDatabase() as TestDatabase;
    db.clear();
    db.addBatch(ServiceModulesFixtures.repoFixtures);
  });

  test('успех, get запрос проходит успешно', async () => {
    const getCompanyRequestDod = dodUtility.getRequestDod<GetCompanyRequestDod>(
      'getCompany',
      { id: '28081e4d-1f7e-48c2-92da-21bacd115829' },
      requestId,
    );

    const sut = module.getServiceByName<GetingCompanyService>('getCompany');

    const result = await sut.execute(getCompanyRequestDod);
    expect(result.isSuccess()).toBe(true);
    expect(result.value as CompanyAttrs).toEqual({
      id: '28081e4d-1f7e-48c2-92da-21bacd115829',
      name: 'Windows corp.',
      bin: '111222333444',
      address: '12, Honweywell st., Goodwill, Ogaio',
      employees: ['edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd'],
      admins: ['edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd'],
    });
  });

  test('провал, нет такой компании', async () => {
    const sut = module.getServiceByName<GetingCompanyService>('getCompany');

    const notFindedRequestDod = dodUtility.getRequestDod<GetCompanyRequestDod>(
      'getCompany',
      { id: '1cd34c3b-3bc7-4966-973e-4b3671587b39' },
      requestId,
    );

    const result = await sut.execute(notFindedRequestDod);
    expect(result.isFailure()).toBe(true);
    expect(result.value as CompanyDoesntExistByIdError).toEqual({
      locale: {
        name: 'CompanyDoesntExistByIdError',
        text: 'Не найдена компания с id: {{id}}',
        hint: {
          id: '1cd34c3b-3bc7-4966-973e-4b3671587b39',
        },
      },
      name: 'CompanyDoesntExistByIdError',
      meta: {
        domainType: 'error',
        errorType: 'domain-error',
      },
    });
  });
});
