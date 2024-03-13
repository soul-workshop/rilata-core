import { RilataRequest } from '../controller/types';
import { ServerResolver } from '../server/server-resolver';

export abstract class Middleware {
  protected serverResolver!: ServerResolver;

  init(resolver: ServerResolver): void {
    this.serverResolver = resolver;
  }

  abstract process(req: RilataRequest): Response | undefined
}
