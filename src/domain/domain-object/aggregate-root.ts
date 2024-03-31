import { Logger } from '../../common/logger/logger';
import { dtoUtility } from '../../common/utils/dto/dto-utility';
import { GeneralARDParams } from '../domain-data/params-types';
import { GetARParamsAggregateName, GetNoOutKeysFromARParams } from '../domain-data/type-functions';
import { DtoFieldValidator } from '../validator/field-validator/dto-field-validator';
import { AggregateRootHelper } from './aggregate-helper';

/** Корневой объект - т.е имеет уникальную глобальную идентификацию */
export abstract class AggregateRoot<PARAMS extends GeneralARDParams> {
  protected helper: AggregateRootHelper<PARAMS>;

  /** Обычно используется для идентификации пользователем объекта в списке */
  abstract getShortName(): string;

  constructor(
    protected attrs: PARAMS['attrs'],
    invariantsValidator: DtoFieldValidator<string, true, false, PARAMS['attrs']>,
    aRootName: GetARParamsAggregateName<PARAMS>,
    idName: keyof PARAMS['attrs'] & string,
    version: number,
    outputExcludeAttrs: GetNoOutKeysFromARParams<PARAMS>,
    logger: Logger,
  ) {
    this.helper = new AggregateRootHelper<PARAMS>(
      attrs, aRootName, idName, version, outputExcludeAttrs, logger,
    );
    this.checkInveriants(invariantsValidator, attrs);
  }

  getId(): string {
    return this.helper.getId();
  }

  getAttrs(conf: { copy: boolean } = { copy: true }): PARAMS['attrs'] {
    return conf.copy ? dtoUtility.deepCopy(this.attrs) : this.attrs;
  }

  /** Обычно используется для логирования, например в ошибках. */
  toString(): string {
    return `${this.helper.getName()} aggregate root: id-${this.getId()}`;
  }

  getHelper(): AggregateRootHelper<PARAMS> {
    return this.helper;
  }

  protected checkInveriants(
    validator: DtoFieldValidator<string, true, false, PARAMS['attrs']>,
    attrs: PARAMS['attrs'],
  ): void {
    const invariantsResult = validator.validate(attrs);
    if (invariantsResult.isFailure()) {
      throw this.getHelper().getLogger().error(`не соблюдены инварианты агрегата ${this.constructor.name}`, {
        modelAttrs: attrs,
        validatorValue: invariantsResult.value,
      });
    }
  }
}
