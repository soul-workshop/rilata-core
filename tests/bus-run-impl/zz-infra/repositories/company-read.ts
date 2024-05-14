import { storeDispatcher } from '../../../../src/app/async-store/store-dispatcher';
import { DatabaseObjectSavingError } from '../../../../src/common/exeptions';
import { Logger } from '../../../../src/common/logger/logger';
import { failure } from '../../../../src/common/result/failure';
import { success } from '../../../../src/common/result/success';
import { Result } from '../../../../src/common/result/types';
import { dodUtility } from '../../../../src/common/utils/dod/dod-utility';
import { FakeClassImplements } from '../../../fixtures/fake-class-implements';
import { CompanyDoesntExistByBinError } from '../../company-cmd/domain-object/company/repo-errors';
import { CompanyOutAttrs } from '../../company-read/domain/company/params';
import { CompanyReadRepository } from '../../company-read/domain/company/repo';
import { CompanyReadModuleResolver } from '../../company-read/resolver';

export class CompanyReadRepositoryImpl implements CompanyReadRepository {
  testRepo: FakeClassImplements.TestMemoryRepository<
    'company_read_repo', CompanyOutAttrs, 'id'
  >;

  protected logger!: Logger;

  protected resolver!: CompanyReadModuleResolver;

  constructor(testDb: FakeClassImplements.TestMemoryDatabase) {
    this.testRepo = new FakeClassImplements.TestMemoryRepository('company_read_repo', 'id', testDb);
  }

  init(resolver: CompanyReadModuleResolver): void {
    this.logger = resolver.getLogger();
    this.resolver = resolver;
  }

  async addCompany(attrs: CompanyOutAttrs): Promise<void> {
    const existCompany = await this.testRepo.findByAttrs({ bin: attrs.bin });
    if (existCompany) {
      throw this.logger.error(`company by bin: ${attrs.bin} is exist`, attrs);
    }

    const result = await this.testRepo.add({ ...attrs });
    if (result.isSuccess()) return undefined;

    const { requestId } = storeDispatcher.getStoreOrExepction();
    const errStr = `Компания с id: ${attrs.id} уже существует`;
    this.logger.error(errStr, { err: result.value, requestId });
    throw new DatabaseObjectSavingError(errStr);
  }

  async getByBin(bin: string): Promise<Result<CompanyDoesntExistByBinError, CompanyOutAttrs>> {
    const companyRecord = await this.testRepo.findByAttrs({ bin });
    if (companyRecord) {
      return success(companyRecord);
    }
    return failure(dodUtility.getDomainError<CompanyDoesntExistByBinError>(
      'CompanyDoesntExistByBinError',
      'Не найдена компания с БИН: {{bin}}',
      { bin },
    ));
  }
}
