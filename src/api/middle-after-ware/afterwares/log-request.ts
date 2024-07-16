import { RilataRequest } from '#api/controller/types.js';
import { GeneralServerResolver } from '#api/server/types.js';
import { Afterware } from '../afterware.js';

export class LogResponseAfterware extends Afterware<GeneralServerResolver> {
  process(req: RilataRequest, resp: Response): Response {
    const method = `${req.method}`.padEnd(8);
    const path = `${new URL(req.url).pathname}`.padEnd(30);
    const msg = `${method}${path}${resp.status}`;
    this.resolver.getLogger().info(msg);
    return resp;
  }
}
