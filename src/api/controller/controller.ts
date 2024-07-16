import { GeneralModuleResolver } from '../module/types.js';
import { GeneralServerResolver } from '../server/types.js';

/** Обеспечивает переход с http уровня на app уровень и обратно. */
export abstract class Controller<R extends GeneralServerResolver | GeneralModuleResolver> {
  resolver!: R;

  init(resolver: R): void {
    this.resolver = resolver;
  }

  abstract execute(req: Request): Promise<unknown>

  abstract getUrls(): string[] | RegExp[]
}
