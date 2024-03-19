/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServiceBaseErrors } from '../service/error-types';
import { STATUS_CODES } from './constants';
import { Result } from '../../common/result/types';
import { Controller } from './controller';
import { RilataRequest } from './types';
import { GeneralModuleResolver } from '../module/types';
import { GeneralRequestDod } from '../../domain/domain-data/domain-types';
import { ResultDTO } from '../result-dto';
import { badRequestError } from '../service/constants';
import { dtoUtility } from '../../common/utils/dto/dto-utility';
import { success } from '../../common/result/success';
import { failure } from '../../common/result/failure';

export class ModuleController implements Controller {
  constructor(protected moduleResolver: GeneralModuleResolver) {}

  getUrl(): string {
    return this.moduleResolver.getModuleConfig().ModuleUrl;
  }

  async execute(req: RilataRequest): Promise<Response> {
    const jsonBodyResult = await this.getJsonBody(req);
    if (jsonBodyResult.isFailure()) return this.getFailureResult(jsonBodyResult.value);
    const reqJsonBody = jsonBodyResult.value;

    const checkResult = this.checkRequestDodBody(reqJsonBody);
    if (checkResult.isFailure()) {
      return this.getFailureResult(checkResult.value);
    }
    const requestDod = checkResult.value;

    const serviceResult = await this.moduleResolver
      .getModule()
      .executeService(requestDod, req.caller);
    if (serviceResult.isSuccess()) {
      return this.getSuccessResult(serviceResult.value);
    }
    const err = (serviceResult as Result<ServiceBaseErrors, never>).value;
    return this.getFailureResult(err);
  }

  // eslint-disable-next-line max-len
  protected async getJsonBody(req: RilataRequest): Promise<Result<typeof badRequestError, unknown>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return success(await req.json());
    } catch (e) {
      const err = dtoUtility.replaceAttrs(badRequestError, { locale: {
        text: 'Ошибка при десерилизации тела запроса (json)',
      } });
      return failure(err);
    }
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

  // eslint-disable-next-line max-len
  protected checkRequestDodBody(input: unknown): Result<typeof badRequestError, GeneralRequestDod> {
    function getErr(errText: string): Result<typeof badRequestError, never> {
      const err = dtoUtility.replaceAttrs(badRequestError, { locale: {
        text: errText,
      } });
      return failure(err);
    }

    if (typeof input !== 'object' || input === null) {
      return getErr('Тело запроса должно быть объектом');
    }

    if ((input as any)?.meta?.name === undefined) {
      return getErr('Полезная нагрузка запроса не является объектом requestDod');
    }

    if ((input as any).attrs === undefined) {
      return getErr('Не найдены атрибуты (attrs) объекта requestDod');
    }
    return success(input as GeneralRequestDod);
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
