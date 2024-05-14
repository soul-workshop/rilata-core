import { storeDispatcher } from '../../../../../../src/app/async-store/store-dispatcher';
import { CommandService } from '../../../../../../src/app/service/concrete-service/command.service';
import { UowTransactionStrategy } from '../../../../../../src/app/service/transaction-strategy/uow.strategy';
import { ServiceResult } from '../../../../../../src/app/service/types';
import { failure } from '../../../../../../src/common/result/failure';
import { success } from '../../../../../../src/common/result/success';
import { Result } from '../../../../../../src/common/result/types';
import { dodUtility } from '../../../../../../src/common/utils/dod/dod-utility';
import { CompanyCmdARFactory } from '../../../domain-object/company/factory';
import { CompanyCmdRepository } from '../../../domain-object/company/repo';
import { CompanyAlreadyExistError } from '../../../domain-object/company/repo-errors';
import { CompanyCmdModuleResolver } from '../../../resolver';
import {
  AddCompanyServiceParams, AddCompanyOut, AddCompanyRequestDod, AddCompanyRequestDodAttrs,
} from './s.params';
import { addCompanyValidator } from './v.map';

export class AddingCompanyService extends CommandService<
  AddCompanyServiceParams, CompanyCmdModuleResolver
> {
  inputDodName = 'addCompany' as const;

  serviceName = 'AddingCompanyService' as const;

  moduleName = 'CompanyCmdModule' as const;

  aRootName = 'CompanyAR' as const;

  protected transactionStrategy = new UowTransactionStrategy(true);

  protected supportedCallers = ['DomainUser'] as const;

  protected validator = addCompanyValidator;

  async runDomain(
    input: AddCompanyRequestDod,
  ): Promise<ServiceResult<AddCompanyServiceParams>> {
    const { caller } = storeDispatcher.getStoreOrExepction();
    if (caller.type !== 'DomainUser') {
      throw this.logger.error(`not supported called by call: ${caller.type}`);
    }

    const existCompanyResult = await this.existCompany(input.attrs.bin);
    if (existCompanyResult.isFailure()) return failure(existCompanyResult.value);

    return this.addCompany(input.attrs);
  }

  protected async existCompany(bin: string): Promise<Result<CompanyAlreadyExistError, undefined>> {
    const companyRepo = CompanyCmdRepository.instance(this.moduleResolver);
    const getResult = await companyRepo.getByBin(bin);
    if (getResult.isSuccess()) {
      const err = dodUtility.getDomainError<CompanyAlreadyExistError>(
        'CompanyAlreadyExistError',
        'Компания с БИН {{bin}} уже существует',
        { bin },
      );
      return failure(err);
    }
    return success(undefined);
  }

  protected async addCompany(
    input: AddCompanyRequestDodAttrs,
  ): Promise<Result<CompanyAlreadyExistError, AddCompanyOut>> {
    const companyFactory = new CompanyCmdARFactory(this.logger);
    const company = companyFactory.create(input);
    const companyRepo = CompanyCmdRepository.instance(this.moduleResolver);
    return companyRepo.addCompany(company);
  }
}
