import { BaseService } from './base-service';
import { GeneralQueryServiceParams } from './types';

export abstract class QueryService<PARAMS extends GeneralQueryServiceParams>
  extends BaseService<PARAMS> {}
