import { storeDispatcher } from '../../../../src/app/async-store/store-dispatcher';
import { EventRepository } from '../../../../src/app/database/event.repository';
import { DatabaseObjectSavingError } from '../../../../src/common/exeptions';
import { Logger } from '../../../../src/common/logger/logger';
import { failure } from '../../../../src/common/result/failure';
import { success } from '../../../../src/common/result/success';
import { Result } from '../../../../src/common/result/types';
import { dodUtility } from '../../../../src/common/utils/domain-object/dod-utility';
import { FakeClassImplements } from '../../../fixtures/fake-class-implements';
import { CompanyAttrs } from '../../company-cmd/domain-data/company/params';
import { CompanyAR } from '../../company-cmd/domain-object/company/a-root';
import { CompanyCmdARFactory } from '../../company-cmd/domain-object/company/factory';
import { CompanyCmdRepository } from '../../company-cmd/domain-object/company/repo';
import { CompanyAlreadyExistError, CompanyDoesntExistByBinError } from '../../company-cmd/domain-object/company/repo-errors';
import { CompanyCmdModuleResolver } from '../../company-cmd/resolver';

export class CompanyCmdRepositoryImpl implements CompanyCmdRepository {
  testRepo: FakeClassImplements.TestMemoryRepository<
    'company_cmd_repo', CompanyAttrs & { version: number }, 'id'
  >;

  protected logger!: Logger;

  protected resolver!: CompanyCmdModuleResolver;

  constructor(testDb: FakeClassImplements.TestMemoryDatabase) {
    this.testRepo = new FakeClassImplements.TestMemoryRepository('company_cmd_repo', 'id', testDb);
  }

  init(resolver: CompanyCmdModuleResolver): void {
    this.logger = resolver.getLogger();
    this.resolver = resolver;
  }

  async addCompany(company: CompanyAR): Promise<Result<CompanyAlreadyExistError, { id: string; }>> {
    const attrs = company.getAttrs();
    const existCompany = await this.testRepo.findByAttrs({ bin: attrs.bin });
    if (existCompany) {
      return failure(dodUtility.getDomainError<CompanyAlreadyExistError>(
        'CompanyAlreadyExistError',
        'Компания с БИН {{bin}} уже существует',
        { bin: attrs.bin },
      ));
    }

    this.addEvents(company);

    const { version } = company.getHelper().getMeta();
    const result = await this.testRepo.add({ ...attrs, version });
    if (result.isSuccess()) return success({ id: attrs.id });

    const { requestId } = storeDispatcher.getStoreOrExepction();
    this.logger.error(`Компания с id: ${attrs.id} уже существует`, { err: result.value, requestId });
    throw new DatabaseObjectSavingError();
  }

  async getByBin(bin: string): Promise<Result<CompanyDoesntExistByBinError, CompanyAR>> {
    const companyRecord = await this.testRepo.findByAttrs({ bin });
    if (companyRecord) {
      const { version, ...attrs } = companyRecord;
      const logger = storeDispatcher.getStoreOrExepction().moduleResolver.getLogger();
      const factory = new CompanyCmdARFactory(logger);
      return success(factory.restore(attrs, version));
    }
    return failure(dodUtility.getDomainError<CompanyDoesntExistByBinError>(
      'CompanyDoesntExistByBinError',
      'Не найдена компания с БИН: {{bin}}',
      { bin },
    ));
  }

  protected async addEvents(company: CompanyAR): Promise<void> {
    const eventRepo = EventRepository.instance(this.resolver);
    await eventRepo.addEvents(company.getHelper().getEvents());
    company.getHelper().cleanEvents();
  }
}
