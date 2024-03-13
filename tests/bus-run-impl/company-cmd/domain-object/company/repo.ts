import { GeneralModuleResolver } from '../../../../../src/app/module/types';
import { Repositoriable } from '../../../../../src/app/resolves/repositoriable';
import { Result } from '../../../../../src/common/result/types';
import { UuidType } from '../../../../../src/common/types';
import { CompanyAR } from './a-root';
import { CompanyDoesntExistByBinError, CompanyAlreadyExistError } from './repo-errors';

export interface CompanyCmdRepository {
  init(resolver: GeneralModuleResolver): void
  addCompany(company: CompanyAR): Promise<Result<CompanyAlreadyExistError, { id: UuidType }>>
  getByBin(bin: string): Promise<Result<CompanyDoesntExistByBinError, CompanyAR>>
}

export const CompanyCmdRepository = {
  instance(resolver: Repositoriable): CompanyCmdRepository {
    return resolver.getRepository(CompanyCmdRepository) as CompanyCmdRepository;
  },
};
