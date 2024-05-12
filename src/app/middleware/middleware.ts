import { RilataRequest } from '../controller/types';
import { GeneralServerResolver } from '../server/types';

export abstract class Middleware {
  protected serverResolver!: GeneralServerResolver;

  init(resolver: GeneralServerResolver): void {
    this.serverResolver = resolver;
  }

  abstract process(req: RilataRequest): Response | undefined
}
