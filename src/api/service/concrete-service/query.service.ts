import { GeneralModuleResolver } from '../../module/types.js';
import { GeneralQueryServiceParams, ServiceResult } from '../types.js';
import { WebService } from '../web.service.js';

export abstract class QueryService<
  P extends GeneralQueryServiceParams, RES extends GeneralModuleResolver
> extends WebService<P, RES> {
  protected async executeService(input: P['input']): Promise<ServiceResult<P>> {
    return this.runDomain(input);
  }
}
