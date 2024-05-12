import { GeneralModuleResolver } from '../../module/types';
import { BaseService } from '../base.service';
import { GeneralQueryServiceParams, ServiceResult } from '../types';

export abstract class QueryService<
  P extends GeneralQueryServiceParams, RES extends GeneralModuleResolver
> extends BaseService<P, RES> {
  protected async executeService(input: P['input']): Promise<ServiceResult<P>> {
    return this.runDomain(input);
  }
}
