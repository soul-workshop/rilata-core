import { Repositoriable } from '../../../../../src/api/resolve/repositoriable';
import { Result } from '../../../../../src/core/result/types';
import { UuidType } from '../../../../../src/core/types';
import { CompanyModuleResolver } from '../../resolver';
import { CompanyAR } from './a-root';
import { CompanyDoesntExistByBinError, CompanyDoesntExistByIdError, CompanyAlreadyExistError } from './repo-errors';

export interface CompanyRepository {
  init(resolver: CompanyModuleResolver): void
  addCompany(company: CompanyAR): Promise<Result<CompanyAlreadyExistError, { id: UuidType }>>
  getById(id: string): Promise<Result<CompanyDoesntExistByIdError, CompanyAR>>
  getByBin(bin: string): Promise<Result<CompanyDoesntExistByBinError, CompanyAR>>
}

export const CompanyRepository = {
  instance(resolver: Repositoriable): CompanyRepository {
    return resolver.resolveRepo(CompanyRepository) as CompanyRepository;
  },
};
