import { GeneralModuleResolver } from '../module/types';
import { GeneralServerResolver } from '../server/types';

export interface Controller<R extends GeneralServerResolver | GeneralModuleResolver> {
  init(resolver: R): void;

  execute(req: Request): Promise<Response>

  getUrls(): string[] | RegExp[]
}
