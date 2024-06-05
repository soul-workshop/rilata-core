import { describe, expect, test } from 'bun:test';
import { DomainUser } from '../../../../src/api/controller/types';
import { uuidUtility } from '../../../../src/core/utils/uuid/uuid-utility';
import { CompanyModule } from '../../company/module';
import { serverStarter } from '../../zzz-run-server/starter';
import { AuthFacade } from '../facade';
import { AddUserOut } from '../services/user/add-user/s-params';

describe('auth facade tests', async () => {
  const server = serverStarter.start(['CompanyModule', 'AuthModule']);
  const companyModule = server.getModule<CompanyModule>('CompanyModule');
  const companyResolver = companyModule.getModuleResolver();

  test('успех, пользователь добавился, получен массив пользователей из добавленного пользователя', async () => {
    const domainUser: DomainUser = { type: 'DomainUser', userId: uuidUtility.getNewUUID() };
    const sut = AuthFacade.instance(companyResolver);
    const result = await sut.addUser('135135135135', domainUser);
    expect(result.isSuccess()).toBe(true);
    const userValue = result.value as AddUserOut;
    expect(uuidUtility.isValidValue(userValue.userId)).toBe(true);

    const getUsersResult = await sut.getUsers([userValue.userId], domainUser);
    expect(getUsersResult.value).toEqual([
      {
        userId: userValue.userId,
        personIin: '135135135135',
      },
    ]);
  });
});
