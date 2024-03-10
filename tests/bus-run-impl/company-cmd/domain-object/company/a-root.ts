import { Logger } from '../../../../../src/common/logger/logger';
import { AggregateRootHelper } from '../../../../../src/domain/domain-object/aggregate-helper';
import { AggregateRoot } from '../../../../../src/domain/domain-object/aggregate-root';
import { DtoFieldValidator } from '../../../../../src/domain/validator/field-validator/dto-field-validator';
import { CompanyAttrs, CompanyParams } from '../../domain-data/company/params';
import { companyAttrsVMap } from '../../domain-data/company/v-map';

export class CompanyAR extends AggregateRoot<CompanyParams> {
  protected helper: AggregateRootHelper<CompanyParams>;

  protected attrs: CompanyAttrs;

  protected logger: Logger;

  constructor(attrs: CompanyAttrs, version: number, logger: Logger) {
    super();
    this.logger = logger;
    this.checkInveriants(attrs);
    this.attrs = attrs;
    this.helper = new AggregateRootHelper<CompanyParams>(
      'CompanyAR', attrs, 'id', version, [], logger,
    );
  }

  getShortName(): string {
    return `Компания: "${this.attrs.name}"`;
  }

  protected checkInveriants(attrs: CompanyAttrs): void {
    const invariantValidator = new DtoFieldValidator(
      'comanyInvariants', true, { isArray: false }, 'dto', companyAttrsVMap,
    );
    const invariantsResult = invariantValidator.validate(attrs);
    if (invariantsResult.isFailure()) {
      throw this.logger.error('не соблюдены инварианты агрегата Company', {
        companyAttrs: attrs,
        validatorValue: invariantsResult.value,
      });
    }
  }
}
