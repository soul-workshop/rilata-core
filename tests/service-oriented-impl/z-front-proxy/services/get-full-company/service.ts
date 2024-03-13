import { storeDispatcher } from '../../../../../src/app/async-store/store-dispatcher';
import { DomainUser } from '../../../../../src/app/caller';
import { QueryService } from '../../../../../src/app/service/query-service';
import { ServiceResult } from '../../../../../src/app/service/types';
import { failure } from '../../../../../src/common/result/failure';
import { success } from '../../../../../src/common/result/success';
import { UserId, UuidType } from '../../../../../src/common/types';
import { AuthFacade } from '../../../auth/facade';
import { CompanyFacade } from '../../../company/facade';
import { SubjectFacade } from '../../../subject/facade';
import { FullUser } from '../../domain-data/full-company/params';
import { GetFullCompanyRequestDod, GetFullCompanyServiceParams } from './s-params';
import { getFullCompanyValidator } from './v-map';

export class GetingFullCompanyService extends QueryService<GetFullCompanyServiceParams> {
  serviceName = 'GetFullCompanyRequestDod' as const;

  aRootName = 'FullCompany' as const;

  protected supportedCallers = ['DomainUser'] as const;

  protected validator = getFullCompanyValidator;

  protected async runDomain(
    input: GetFullCompanyRequestDod,
  ): Promise<ServiceResult<GetFullCompanyServiceParams>> {
    const store = storeDispatcher.getStoreOrExepction();
    const { caller } = store;
    let domainUser: DomainUser;
    if (caller.type === 'DomainUser') {
      domainUser = caller;
    } else if (caller.type === 'ModuleCaller' && caller.user.type === 'DomainUser') {
      domainUser = caller.user;
    } else throw this.logger.error('supported only domain user caller');

    return this.getFullCompany(input.attrs.id, domainUser);
  }

  protected async getFullCompany(
    companyId: UuidType, domainUser: DomainUser,
  ): Promise<ServiceResult<GetFullCompanyServiceParams>> {
    const companyFacade = CompanyFacade.instance(this.moduleResolver);
    const companyResult = await companyFacade.getCompany(companyId, domainUser);
    if (companyResult.isFailure()) return failure(companyResult.value);
    const companyAttrs = companyResult.value;
    const employees = await this.getFullUsers(companyAttrs.employees, domainUser);
    return success({
      ...companyAttrs,
      employees,
    });
  }

  protected async getFullUsers(userIds: UserId[], domainUser: DomainUser): Promise<FullUser[]> {
    const authFacade = AuthFacade.instance(this.moduleResolver);
    const usersResult = await authFacade.getUsers(userIds, domainUser);
    const users = usersResult.value;
    const subjectFacade = SubjectFacade.instance(this.moduleResolver);
    const personResults = await Promise.all(users.map(
      (userAttrs) => subjectFacade.getPersonByIin(userAttrs.personIin, domainUser),
    ));
    const persons = personResults.map((result) => {
      if (result.isFailure()) {
        throw this.logger.error(
          'Некоторые объекты персон для объектов пользователей не найдены',
          personResults.map((r) => ({ isSuccess: r.isSuccess(), value: r.value })),
        );
      }
      return result.value;
    });
    return users.map((user, index) => (
      {
        userId: user.userId,
        person: persons[index],
      }
    ));
  }
}
