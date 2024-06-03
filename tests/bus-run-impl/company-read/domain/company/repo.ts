import { GeneralModuleResolver } from '../../../../../src/api/module/types';
import { Repositoriable } from '../../../../../src/api/resolve/repositoriable';
import { Result } from '../../../../../src/core/result/types';
import { CompanyDoesntExistByBinError } from '../../../company-cmd/domain-object/company/repo-errors';
import { CompanyOutAttrs } from './params';

export interface CompanyReadRepository {
  init(resolver: GeneralModuleResolver): void
  addCompany(attrs: CompanyOutAttrs): Promise<void>
  getByBin(bin: string): Promise<Result<CompanyDoesntExistByBinError, CompanyOutAttrs>>
}

export const CompanyReadRepository = {
  instance(resolver: Repositoriable): CompanyReadRepository {
    return resolver.resolveRepo(CompanyReadRepository) as CompanyReadRepository;
  },
};
