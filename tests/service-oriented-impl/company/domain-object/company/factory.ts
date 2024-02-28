import { uuidUtility } from '../../../../../src/common/utils/uuid/uuid-utility';
import { AggregateFactory } from '../../../../../src/domain/domain-object/aggregate-factory';
import { CompanyAttrs, CompanyParams } from '../../domain-data/company/params';
import { CompanyRegisteredEvent, RegisterCompanyDomainCommand } from '../../domain-data/company/register-company/a-params';
import { CompanyAR } from './a-root';

export class CompanyARFactory extends AggregateFactory<CompanyParams> {
  create(command: RegisterCompanyDomainCommand): CompanyAR {
    const attrs = { id: uuidUtility.getNewUUID(), ...command };
    const company = new CompanyAR(attrs, 0, this.logger);
    company.getHelper().registerEvent<CompanyRegisteredEvent>('CompanyRegisteredEvent', command);
    return company;
  }

  restore(attrs: CompanyAttrs, version: number): CompanyAR {
    return new CompanyAR(attrs, version, this.logger);
  }
}
