import { describe, test, expect } from 'bun:test';
import { TestDatabase } from '../../../../src/app/database/test-database';
import { dodUtility } from '../../../../src/common/utils/domain-object/dod-utility';
import { FakeClassImplements } from '../../../fixtures/fake-class-implements';
import { AuthModule } from '../../auth/module';
import { CompanyModule } from '../../company/module';
import { GetCompanyRequestDod } from '../../company/services/get-company/s.params';
import { SubjectModule } from '../../subject/module';
import { GetPersonByIinRequestDod } from '../../subject/services/person/get-by-iin/s-params';
import { ServiceModulesResolver } from '../resolver';
import { ServiceModulesBunServer } from '../server';
import { ServiceModulesFixtures } from '../server-fixtures';

describe('process http requests by server class', async () => {
  const sut = new ServiceModulesBunServer('all', 'test');
  const serverResolver = new ServiceModulesResolver();
  sut.init(serverResolver);

  [
    sut.getModule<SubjectModule>('SubjectModule'),
    sut.getModule<CompanyModule>('CompanyModule'),
    sut.getModule<AuthModule>('AuthModule'),
  ].forEach((module) => {
    const db = module.getModuleResolver().getDatabase() as TestDatabase;
    db.addBatch(ServiceModulesFixtures.repoFixtures);
  });

  const tokenCreator = new FakeClassImplements.TestTokenVerifier();
  const authToken = tokenCreator.getHashedToken(tokenCreator.createToken(
    { userId: '2a96aec7-1091-4449-8369-c3d9f91f1a56' },
  ));

  test('successfull, person by iin returned by http request', async () => {
    const requestDod = dodUtility.getRequestDod<GetPersonByIinRequestDod>(
      'getPersonByIin',
      { iin: '123123123123' },
    );
    const req = new Request(new URL('http://0.0.0.0:3000/api/subject-module/'), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: authToken,
      },
      body: JSON.stringify(requestDod),
    });
    const resp = await sut.fetch(req);
    expect(await resp.json()).toEqual({
      httpStatus: 200,
      success: true,
      payload: {
        id: 'b433034e-8090-4c7d-8738-8cb78bbc6792',
        firstName: 'Bill',
        lastName: 'Geits',
        iin: '123123123123',
        contacts: {
          emails: [
            {
              type: 'corporate',
              email: 'bill@microsoft.com',
            },
          ],
        },
      },
    });
  });

  test('failure, only post request supports', async () => {
    const req = new Request(new URL('http://0.0.0.0:3000/api/subject-module/'), {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: authToken,
      },
    });
    const resp = await sut.fetch(req);
    expect(await resp.json()).toEqual({
      httpStatus: 400,
      payload: {
        locale: {
          hint: {},
          name: 'Bad request',
          text: 'Поддерживаются только post запросы',
        },
        meta: {
          domainType: 'error',
          errorType: 'app-error',
        },
        name: 'Bad request',
      },
      success: false,
    });
  });

  test('failure, not found service by request dod name', async () => {
    const someInputDto = { someAttr: 'some value' };
    const req = new Request(new URL('http://0.0.0.0:3000/api/another-url/'), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: authToken,
      },
      body: JSON.stringify(someInputDto),
    });
    const resp = await sut.fetch(req);
    expect(await resp.json()).toEqual({
      httpStatus: 404,
      payload: {
        locale: {
          hint: { url: '/api/another-url/' },
          name: 'Not found',
          text: 'Запрос по адресу: {{url}} не может быть обработана',
        },
        meta: {
          domainType: 'error',
          errorType: 'app-error',
        },
        name: 'Not found',
      },
      success: false,
    });
  });

  test('failure, not found service by request dod name', async () => {
    // request dod on company module, not founded on subject module
    const requestDod = dodUtility.getRequestDod<GetCompanyRequestDod>(
      'getCompany',
      { id: 'some company id' },
    );
    const req = new Request(new URL('http://0.0.0.0:3000/api/subject-module/'), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: authToken,
      },
      body: JSON.stringify(requestDod),
    });
    const resp = await sut.fetch(req);
    expect(await resp.json()).toEqual({
      httpStatus: 400,
      payload: {
        locale: {
          hint: {},
          name: 'Bad request',
          text: 'Не найден обработчик для запроса getCompany в модуле SubjectModule',
        },
        meta: {
          domainType: 'error',
          errorType: 'app-error',
        },
        name: 'Bad request',
      },
      success: false,
    });
  });

  test('failure, not recieved request dod', async () => {
    const inputDto = { id: 'some company id' };
    const req = new Request(new URL('http://0.0.0.0:3000/api/subject-module/'), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: authToken,
      },
      body: JSON.stringify(inputDto),
    });
    const resp = await sut.fetch(req);
    expect(await resp.json()).toEqual({
      httpStatus: 400,
      payload: {
        locale: {
          hint: {},
          name: 'Bad request',
          text: 'Полезная нагрузка запроса не является объектом requestDod',
        },
        meta: {
          domainType: 'error',
          errorType: 'app-error',
        },
        name: 'Bad request',
      },
      success: false,
    });
  });
});
