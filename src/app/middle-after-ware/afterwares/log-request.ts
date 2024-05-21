import { GeneralServerResolver } from '../../base.index';
import { RilataRequest } from '../../http.index';
import { Afterware } from '../afterware';

export class LogResponseAfterware extends Afterware<GeneralServerResolver> {
  process(req: RilataRequest, resp: Response): Response {
    const method = `${req.method}:`.padEnd(8);
    const path = `${new URL(req.url).pathname}:`.padEnd(18);
    const msg = `${method}${path}${resp.status}`;
    this.resolver.getLogger().info(msg);
    // eslint-disable-next-line no-console
    console.log(`${new Date().toLocaleString()}:  ${msg}`);
    return resp;
  }
}
