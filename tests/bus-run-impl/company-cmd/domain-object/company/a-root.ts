import { Logger } from '../../../../../src/common/logger/logger';
import { AggregateRoot } from '../../../../../src/domain/domain-object/aggregate-root';
import { CompanyAttrs, CompanyParams } from '../../domain-data/company/params';
import { companyInvariantsValidator } from '../../domain-data/company/v-map';

export class CompanyAR extends AggregateRoot<CompanyParams> {
  protected invariantsValidator = companyInvariantsValidator;

  constructor(attrs: CompanyAttrs, version: number, logger: Logger) {
    super(attrs, 'CompanyAR', 'id', version, [], logger);
  }

  getShortName(): string {
    return `Компания: "${this.attrs.name}"`;
  }
}
