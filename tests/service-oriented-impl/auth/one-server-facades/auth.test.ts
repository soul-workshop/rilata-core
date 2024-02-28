import { describe, expect, test } from 'bun:test';
import { DomainUser } from '../../../../src/app/caller';
import { uuidUtility } from '../../../../src/common/utils/uuid/uuid-utility';
import { CompanyModule } from '../../company/module';
import { ServiceModulesFixtures } from '../../zzz-run-server/server-fixtures';
import { AuthFacade } from '../facade';
import { AuthModule } from '../module';

describe('auth facade tests', async () => {
  const server = await ServiceModulesFixtures.getServer<AuthModule | CompanyModule>(['CompanyModule', 'AuthModule']);
  const companyModule = server.getModule<CompanyModule>('CompanyModule');
  const companyResolver = companyModule.getModuleResolver();

  test('успех, пользователь добавился, получен массив пользователей из добавленного пользователя', async () => {
    const domainUser: DomainUser = { type: 'DomainUser', userId: uuidUtility.getNewUUID() };
    const sut = AuthFacade.instance(companyResolver);
    const result = await sut.addUser('135135135135', domainUser);
    expect(result.isSuccess()).toBe(true);
    expect(uuidUtility.isValidValue(result.value.userId)).toBe(true);

    const getUsersResult = await sut.getUsers([result.value.userId], domainUser);
    expect(getUsersResult.value).toEqual([
      {
        userId: result.value.userId,
        personIin: '135135135135',
      },
    ]);
  });
});
