import {
  describe, test, expect,
} from 'bun:test';
import { EventRepository } from '../../../src/app/database/event-repository';
import { dodUtility } from '../../../src/common/utils/domain-object/dod-utility';
import { dtoUtility } from '../../../src/common/utils/dto/dto-utility';
import { uuidUtility } from '../../../src/common/utils/uuid/uuid-utility';
import { FakeClassImplements } from '../../fixtures/fake-class-implements';
import { AddCompanyRequestDod, AddCompanyRequestDodAttrs } from '../company-cmd/services/company/add-company/s.params';
import { CompanyOutAttrs } from '../company-read/domain/company/params';
import { CompanyReadRepository } from '../company-read/domain/company/repo';
import { CompanyReadModule } from '../company-read/module';
import { BusRunFixtures } from '../zzz-bus-run/server-fixtures';

describe('add company service tests', async () => {
  function timeout() {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  const requestId = 'c22fd027-a94b-4728-90eb-f6d4f96992c2';
  const testSever = await BusRunFixtures.getServer();

  const addCompanyRequestDodAttrs: AddCompanyRequestDodAttrs = {
    name: 'Google corporation',
    bin: '222333444555',
  };
  const addCompanyRequestDod = dodUtility.getRequestDod<AddCompanyRequestDod>(
    'addCompany', addCompanyRequestDodAttrs, requestId,
  );

  const tokenCreator = new FakeClassImplements.TestTokenVerifier();
  const authToken = tokenCreator.getHashedToken(tokenCreator.createToken(
    { userId: '2a96aec7-1091-4449-8369-c3d9f91f1a56' },
  ));

  test('успех, компания успешно добавлена, событие доставлено до read-module и успешно обработано', async () => {
    // execute service
    const req = new Request(new URL('http://0.0.0.0:3000/api/company-cmd-module/'), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: authToken,
      },
      body: JSON.stringify(dtoUtility.deepCopy(addCompanyRequestDod)),
    });

    const resp = await testSever.fetch(req);
    const respJson = await resp.json();
    const newCompanyId = respJson?.payload?.id;

    // check response
    expect(uuidUtility.isValidValue(newCompanyId)).toBe(true);
    expect(respJson).toEqual({
      httpStatus: 200,
      success: true,
      payload: { id: newCompanyId },
    });

    // check event delivered and handled
    const readResolver = testSever
      .getModule<CompanyReadModule>('CompanyReadModule')
      .getModuleResolver();

    await timeout(); // run all timouts

    const readRepo = CompanyReadRepository.instance(readResolver);
    const result = await readRepo.getByBin('222333444555');
    expect(result.isSuccess()).toBe(true);
    const companyAttrs = result.value as CompanyOutAttrs;
    expect(companyAttrs).toEqual({
      id: newCompanyId,
      name: 'Google corporation',
      bin: '222333444555',
      version: 0,
    });

    // check event added for read module
    const eventRepo = EventRepository.instance(readResolver);
    setTimeout(async () => {
      const events = await eventRepo.getAggregateEvents(newCompanyId);
      expect(events.length).toBe(1);
      const event = events[0];
      expect(event).toEqual({
        attrs: {
          bin: '222333444555',
          name: 'Google corporation',
        },
        meta: {
          domainType: 'event',
          eventId: event.meta.eventId,
          moduleName: 'CompanyReadModule',
          name: 'CompanyAddedEvent',
          requestId: 'c22fd027-a94b-4728-90eb-f6d4f96992c2',
          created: event.meta.created,
        },
        caller: {
          type: 'DomainUser',
          userId: '2a96aec7-1091-4449-8369-c3d9f91f1a56',
        },
        aRoot: {
          attrs: {
            bin: '222333444555',
            id: event.aRoot.attrs.id,
            name: 'Google corporation',
          },
          meta: {
            domainType: 'aggregate',
            idName: 'id',
            name: 'CompanyAR',
            version: 0,
          },
        },
      });
    }, 0);
    await timeout();
  });
});
