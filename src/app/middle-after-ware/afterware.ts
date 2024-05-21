import { RilataRequest } from '../controller/types';
import { GeneralModuleResolver } from '../module/types';
import { GeneralServerResolver } from '../server/types';

export abstract class Afterware<R extends GeneralServerResolver | GeneralModuleResolver> {
  protected resolver!: R;

  init(resolver: R): void {
    this.resolver = resolver;
  }

  /** Постобработка всех запросов. */
  abstract process(req: RilataRequest, resp: Response): Response
}
