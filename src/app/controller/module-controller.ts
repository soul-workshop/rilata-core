import { BadRequestError, ServiceBaseErrors } from '../service/error-types';
import { STATUS_CODES } from './constants';
import { Result } from '../../common/result/types';
import { Controller } from './controller';
import { RilataRequest } from './types';
import { GeneralModuleResolver } from '../module/types';
import { GeneralRequestDod } from '../../domain/domain-data/domain-types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';
import { ResultDTO } from '../result-dto';

export class ModuleController implements Controller {
  constructor(protected moduleResolver: GeneralModuleResolver) {}

  getUrl(): string {
    return this.moduleResolver.getModuleConfig().ModuleUrl;
  }

  async execute(req: RilataRequest): Promise<Response> {
    const requestDod = await req.json() as GeneralRequestDod;
    const checkResult = this.checkRequestDodBody(requestDod);
    if (checkResult) {
      return checkResult;
    }

    const serviceResult = await this.moduleResolver
      .getModule()
      .executeService(requestDod, req.caller);
    if (serviceResult.isSuccess()) {
      return this.getSuccessResult(serviceResult.value);
    }
    const err = (serviceResult as Result<ServiceBaseErrors, never>).value;
    return this.getFailureResult(err);
  }

  protected getSuccessResult(payload: unknown): Response {
    const resultDto: ResultDTO<never, unknown> = {
      httpStatus: 200,
      success: true,
      payload,
    };
    return new Response(JSON.stringify(resultDto), {
      status: resultDto.httpStatus,
    });
  }

  protected checkRequestDodBody(input: GeneralRequestDod): Response | undefined {
    if (input?.meta?.name === undefined) {
      const err = dodUtility.getAppError<BadRequestError<Locale<'Bad request'>>>(
        'Bad request',
        'Полезная нагрузка запроса не является объектом requestDod',
        {},
      );
      return this.getFailureResult(err);
    } if (input.attrs === undefined) {
      const err = dodUtility.getAppError<BadRequestError<Locale<'Bad request'>>>(
        'Bad request',
        'Не найдены атрибуты (attrs) объекта requestDod',
        {},
      );
      return this.getFailureResult(err);
    }
    return undefined;
  }

  protected getFailureResult(err: ServiceBaseErrors): Response {
    const resultDto: ResultDTO<ServiceBaseErrors, never> = {
      httpStatus: STATUS_CODES[err.name] ?? 400,
      success: false,
      payload: err,
    };
    return new Response(JSON.stringify(resultDto), {
      status: resultDto.httpStatus,
    });
  }
}
