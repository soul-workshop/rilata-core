import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';
import { RilataRequest } from '../controller/types';
import { ResultDTO } from '../result-dto';
import { BadRequestError } from '../service/error-types';
import { Middleware } from './middleware';

export class OnlyPostMethodMiddleware extends Middleware {
  process(req: RilataRequest): Response | undefined {
    if (req.method !== 'POST') {
      const respBody: ResultDTO<BadRequestError<Locale<'Bad request'>>, never> = {
        success: false,
        payload: dodUtility.getAppError<BadRequestError<Locale<'Bad request'>>>(
          'Bad request',
          'Поддерживаются только post запросы',
          {},
        ),
        httpStatus: 400,
      };
      // eslint-disable-next-line consistent-return
      return new Response(JSON.stringify(respBody), { status: 400 });
    }
    return undefined;
  }
}
