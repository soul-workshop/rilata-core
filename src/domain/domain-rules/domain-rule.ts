import { Result } from '../../common/result/types';
import { GeneralErrorDOD } from '../domain-object-data/types';

/** Правила предметной области которые могут заблокировать выполнение запроса */
export interface DomainRule {
  check(...args: unknown[]): Result<GeneralErrorDOD, undefined>;
}
