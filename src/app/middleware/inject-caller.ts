import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { RilataRequest } from '../controller/types';
import { IncorrectTokenError } from '../jwt/jwt-errors';
import { ResultDTO } from '../result-dto';
import { Middleware } from './middleware';

export class InjectCallerMiddleware extends Middleware {
  process(req: RilataRequest): Response | undefined {
    let rawToken = req.headers.get('authorization');
    if (!rawToken) {
      req.caller = {
        type: 'AnonymousUser',
      };
      return;
    }

    rawToken = rawToken?.includes('Bearer ') ? rawToken.replace('Bearer ', '') : rawToken;
    const verifyResult = this.serverResolver.getTokenVerifier().verifyToken(rawToken);
    if (verifyResult.isFailure()) {
      const respBody: ResultDTO<IncorrectTokenError, never> = {
        success: false,
        payload: dodUtility.getDomainError<IncorrectTokenError>(
          'IncorrectTokenError',
          'Невозможно расшифровать токен. Токен имеет не верный формат.',
          {},
        ),
        httpStatus: 400,
      };
      // eslint-disable-next-line consistent-return
      return new Response(JSON.stringify(respBody), { status: 400 });
    }

    req.caller = {
      type: 'DomainUser',
      userId: verifyResult.value.userId,
    };
  }
}
