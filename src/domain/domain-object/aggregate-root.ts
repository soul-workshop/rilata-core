import { dtoUtility } from '../../common/utils/dto/dto-utility';
import { GeneralARDParams } from '../domain-data/params-types';
import { AggregateRootHelper } from './aggregate-helper';

/** Корневой объект - т.е имеет уникальную глобальную идентификацию */
export abstract class AggregateRoot<PARAMS extends GeneralARDParams> {
  protected abstract helper: AggregateRootHelper<PARAMS>;

  protected abstract attrs: PARAMS['attrs'];

  /** Обычно используется для идентификации пользователем объекта в списке */
  abstract getShortName(): string;

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
}
