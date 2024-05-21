import { GeneralModuleResolver } from '../base.index';
import { RilataRequest } from '../controller/types';
import { GeneralServerResolver } from '../server/types';

export abstract class Middleware<R extends GeneralServerResolver | GeneralModuleResolver> {
  protected resolver!: R;

  init(resolver: R): void {
    this.resolver = resolver;
  }

  /**
    Предварительная обработка всех запросов.
    Если вернет Response, то ответ получен и запрос дальше не пойдет.
  */
  abstract process(req: RilataRequest): Response | undefined
}
