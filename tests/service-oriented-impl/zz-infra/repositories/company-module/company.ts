import { storeDispatcher } from '../../../../../src/app/async-store/store-dispatcher';
import { DatabaseObjectSavingError } from '../../../../../src/common/exeptions';
import { Logger } from '../../../../../src/common/logger/logger';
import { failure } from '../../../../../src/common/result/failure';
import { success } from '../../../../../src/common/result/success';
import { Result } from '../../../../../src/common/result/types';
import { UuidType } from '../../../../../src/common/types';
import { dodUtility } from '../../../../../src/common/utils/domain-object/dod-utility';
import { FakeClassImplements } from '../../../../fixtures/fake-class-implements';
import { CompanyAttrs } from '../../../company/domain-data/company/params';
import { CompanyAR } from '../../../company/domain-object/company/a-root';
import { CompanyARFactory } from '../../../company/domain-object/company/factory';
import { CompanyRepository } from '../../../company/domain-object/company/repo';
import { CompanyDoesntExistByBinError, CompanyDoesntExistByIdError, CompanyAlreadyExistError } from '../../../company/domain-object/company/repo-errors';
import { CompanyModuleResolver } from '../../../company/resolver';

export class CompanyRepositoryImpl implements CompanyRepository {
  testRepo: FakeClassImplements.TestMemoryRepository<
    'company_repo', CompanyAttrs & { version: number }, 'id'
  >;

  protected logger!: Logger;

  constructor(testDb: FakeClassImplements.TestMemoryDatabase) {
    this.testRepo = new FakeClassImplements.TestMemoryRepository('company_repo', 'id', testDb);
  }

  init(resolver: CompanyModuleResolver): void {
    this.logger = resolver.getLogger();
  }

  async addCompany(
    company: CompanyAR,
  ): Promise<Result<CompanyAlreadyExistError, { id: UuidType }>> {
    const attrs = company.getAttrs();
    const existCompany = await this.testRepo.findByAttrs({ bin: attrs.bin });
    if (existCompany) {
      return failure(dodUtility.getDomainError<CompanyAlreadyExistError>(
        'CompanyAlreadyExistError',
        'Компания с БИН {{bin}} уже существует',
        { bin: attrs.bin },
      ));
    }

    const { version } = company.getHelper().getMeta();
    const result = await this.testRepo.add({ ...attrs, version });
    if (result.isSuccess()) return success({ id: attrs.id });

    const logger = storeDispatcher.getStoreOrExepction().moduleResolver.getLogger();
    const { requestId } = storeDispatcher.getStoreOrExepction();
    logger.error(`Компания с id: ${attrs.id} уже существует`, { err: result.value, requestId });
    throw new DatabaseObjectSavingError();
  }

  async getById(id: string): Promise<Result<CompanyDoesntExistByIdError, CompanyAR>> {
    const companyRecord = await this.testRepo.find(id);
    if (companyRecord) {
      const { version, ...attrs } = companyRecord;
      const logger = storeDispatcher.getStoreOrExepction().moduleResolver.getLogger();
      const factory = new CompanyARFactory(logger);
      return success(factory.restore(attrs, version));
    }
    return failure(dodUtility.getDomainError<CompanyDoesntExistByIdError>(
      'CompanyDoesntExistByIdError',
      'Не найдена компания с id: {{id}}',
      { id },
    ));
  }

  async getByBin(bin: string): Promise<Result<CompanyDoesntExistByBinError, CompanyAR>> {
    const companyRecord = await this.testRepo.findByAttrs({ bin });
    if (companyRecord) {
      const { version, ...attrs } = companyRecord;
      const logger = storeDispatcher.getStoreOrExepction().moduleResolver.getLogger();
      const factory = new CompanyARFactory(logger);
      return success(factory.restore(attrs, version));
    }
    return failure(dodUtility.getDomainError<CompanyDoesntExistByBinError>(
      'CompanyDoesntExistByBinError',
      'Не найдена компания с БИН: {{bin}}',
      { bin },
    ));
  }
}
