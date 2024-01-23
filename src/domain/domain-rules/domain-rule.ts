import { Result } from '../../common/result/types';
import { GeneralErrorDod } from '../domain-data/domain-types';

/** Правила предметной области которые могут заблокировать выполнение запроса */
export interface DomainRule {
  check(...args: unknown[]): Result<GeneralErrorDod, undefined>;
}
