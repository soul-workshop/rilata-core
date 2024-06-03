import { GeneralModuleResolver } from '../module/types';
import { GeneralServerResolver } from '../server/types';

export abstract class Controller<R extends GeneralServerResolver | GeneralModuleResolver> {
  resolver!: R;

  init(resolver: R): void {
    this.resolver = resolver;
  }

  abstract execute(req: Request): Promise<Response>

  abstract getUrls(): string[] | RegExp[]
}
