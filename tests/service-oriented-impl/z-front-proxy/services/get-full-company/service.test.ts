import {
  beforeEach, describe, expect, test,
} from 'bun:test';
import { DomainUser } from '../../../../../src/app/caller';
import { TestDatabase } from '../../../../../src/app/database/test-database';
import { dodUtility } from '../../../../../src/common/utils/domain-object/dod-utility';
import { AuthModule } from '../../../auth/module';
import { CompanyModule } from '../../../company/module';
import { SubjectModule } from '../../../subject/module';
import { serverStarter } from '../../../zzz-run-server/starter';
import { ServiceModulesFixtures } from '../../../zzz-run-server/server-fixtures';
import { FullCompany } from '../../domain-data/full-company/params';
import { FrontProxyModule } from '../../module';
import { GetFullCompanyRequestDod, GetFullCompanyServiceParams } from './s-params';

describe('get full company service tests', async () => {
  const testServer = serverStarter.start('all');
  const requestId = '5611f332-f4d9-4c16-a561-04dabe864fc9';
  const sut = testServer.getModule<FrontProxyModule>('FrontProxyModule');
  const caller: DomainUser = { type: 'DomainUser', userId: 'daa253a3-4575-420a-9a64-11f466871cdc' };

  beforeEach(async () => {
    [
      testServer.getModule<AuthModule>('AuthModule'),
      testServer.getModule<SubjectModule>('SubjectModule'),
      testServer.getModule<CompanyModule>('CompanyModule'),
    ].forEach(async (module) => {
      const db = module.getModuleResolver().getDatabase() as TestDatabase;
      await db.clear();
      await db.addBatch(ServiceModulesFixtures.repoFixtures);
    });
  });

  test('успех, возвращается объект full company', async () => {
    const requestDod = dodUtility.getRequestDod<GetFullCompanyRequestDod>(
      'GetFullCompanyRequestDod',
      { id: '28081e4d-1f7e-48c2-92da-21bacd115829' },
      requestId,
    );

    const result = await sut.executeService<GetFullCompanyServiceParams>(requestDod, caller);
    expect(result.isSuccess()).toBe(true);
    const recieveFullCompany = result.value as FullCompany;
    expect(recieveFullCompany).toEqual({
      id: '28081e4d-1f7e-48c2-92da-21bacd115829',
      name: 'Windows corp.',
      bin: '111222333444',
      address: '12, Honweywell st., Goodwill, Ogaio',
      employees: [
        {
          userId: 'edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd',
          person: {
            id: 'b433034e-8090-4c7d-8738-8cb78bbc6792',
            firstName: 'Bill',
            lastName: 'Geits',
            iin: '123123123123',
            contacts: {
              emails: [{ type: 'corporate', email: 'bill@microsoft.com' }],
            },
          },
        },
      ],
      admins: ['edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd'],
    });
  });
});
