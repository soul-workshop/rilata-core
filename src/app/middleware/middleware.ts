import { DTO } from '../../domain/dto';
import { RilataRequest } from '../controller/types';
import { ServerResolver } from '../server/server-resolver';

export abstract class Middleware {
  protected serverResolver!: ServerResolver<DTO>;

  init(resolver: ServerResolver<DTO>): void {
    this.serverResolver = resolver;
  }

  abstract process(req: RilataRequest): Response | undefined
}
