import { Logger } from '../../../../../src/core/logger/logger';
import { AggregateRoot } from '../../../../../src/domain/domain-object/aggregate-root';
import { CompanyAttrs, CompanyParams } from '../../domain-data/company/params';
import { companyInvariantsValidator } from '../../domain-data/company/v-map';

export class CompanyAR extends AggregateRoot<CompanyParams> {
  constructor(attrs: CompanyAttrs, version: number, logger: Logger) {
    super(attrs, companyInvariantsValidator, 'CompanyAR', 'id', version, [], logger);
  }

  getShortName(): string {
    return `Компания: "${this.attrs.name}"`;
  }
}
