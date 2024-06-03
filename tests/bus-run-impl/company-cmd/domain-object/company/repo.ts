import { GeneralModuleResolver } from '../../../../../src/api/module/types';
import { Repositoriable } from '../../../../../src/api/resolve/repositoriable';
import { Result } from '../../../../../src/core/result/types';
import { UuidType } from '../../../../../src/core/types';
import { CompanyAR } from './a-root';
import { CompanyDoesntExistByBinError, CompanyAlreadyExistError } from './repo-errors';

export interface CompanyCmdRepository {
  init(resolver: GeneralModuleResolver): void
  addCompany(company: CompanyAR): Promise<Result<CompanyAlreadyExistError, { id: UuidType }>>
  getByBin(bin: string): Promise<Result<CompanyDoesntExistByBinError, CompanyAR>>
}

export const CompanyCmdRepository = {
  instance(resolver: Repositoriable): CompanyCmdRepository {
    return resolver.resolveRepo(CompanyCmdRepository) as CompanyCmdRepository;
  },
};
