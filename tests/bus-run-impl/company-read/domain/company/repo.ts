import { GeneralModuleResolver } from '../../../../../src/app/module/types';
import { Repositoriable } from '../../../../../src/app/resolves/repositoriable';
import { Result } from '../../../../../src/common/result/types';
import { CompanyDoesntExistByBinError } from '../../../company-cmd/domain-object/company/repo-errors';
import { CompanyOutAttrs } from './params';

export interface CompanyReadRepository {
  init(resolver: GeneralModuleResolver): void
  addCompany(attrs: CompanyOutAttrs): Promise<void>
  getByBin(bin: string): Promise<Result<CompanyDoesntExistByBinError, CompanyOutAttrs>>
}

export const CompanyReadRepository = {
  instance(resolver: Repositoriable): CompanyReadRepository {
    return resolver.getRepository(CompanyReadRepository) as CompanyReadRepository;
  },
};
