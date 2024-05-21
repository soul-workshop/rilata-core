/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServiceBaseErrors } from '../service/error-types';
import { STATUS_CODES } from './constants';
import { Result } from '../../common/result/types';
import { Controller } from './controller';
import { ResultDTO, RilataRequest } from './types';
import { GeneralModuleResolver } from '../module/types';
import { GeneralRequestDod } from '../../domain/domain-data/domain-types';
import { badRequestError } from '../service/constants';
import { dtoUtility } from '../../common/utils/dto/dto-utility';
import { success } from '../../common/result/success';
import { failure } from '../../common/result/failure';

export class BaseUrlModuleController implements Controller<GeneralModuleResolver> {
  protected moduleResolver!: GeneralModuleResolver;

  init(moduleResolver: GeneralModuleResolver): void {
    this.moduleResolver = moduleResolver;
  }

  getUrls(): string[] {
    return this.moduleResolver.getModuleUrls();
  }

  async execute(req: RilataRequest): Promise<Response> {
    const jsonBodyResult = await this.getJsonBody(req);
    if (jsonBodyResult.isFailure()) return this.getFailureResponse(jsonBodyResult.value);
    const reqJsonBody = jsonBodyResult.value;

    const checkResult = this.checkRequestDodBody(reqJsonBody);
    if (checkResult.isFailure()) {
      return this.getFailureResponse(checkResult.value);
    }
    const requestDod = checkResult.value;

    const serviceResult = await this.moduleResolver
      .getModule()
      .executeService(requestDod, req.caller);
    if (serviceResult.isSuccess()) {
      return this.getSuccessResponse(serviceResult.value);
    }
    const err = (serviceResult as Result<ServiceBaseErrors, never>).value;
    return this.getFailureResponse(err);
  }

  // eslint-disable-next-line max-len
  protected async getJsonBody(req: RilataRequest): Promise<Result<typeof badRequestError, unknown>> {
    if (req.method !== 'POST') {
      const err = dtoUtility.replaceAttrs(badRequestError, { locale: {
        text: 'Поддерживаются только post запросы',
      } });
      return failure(err);
    }

    try {
      return success(await req.json());
    } catch (e) {
      const err = dtoUtility.replaceAttrs(badRequestError, { locale: {
        text: 'Ошибка при десерилизации тела запроса (json)',
      } });
      return failure(err);
    }
  }

  // eslint-disable-next-line max-len
  protected checkRequestDodBody(input: unknown): Result<typeof badRequestError, GeneralRequestDod> {
    if (typeof input !== 'object' || input === null) {
      return this.getErr('Тело запроса должно быть объектом');
    }

    if (
      (input as any)?.meta?.name === undefined
      || (input as any)?.meta?.requestId === undefined
      || (input as any)?.meta?.domainType !== 'request'
    ) {
      return this.getErr('Полезная нагрузка запроса не является объектом requestDod');
    }

    if (
      !(input as any).attrs
      || typeof (input as any).attrs !== 'object'
    ) {
      return this.getErr('Не найдены атрибуты (attrs) объекта requestDod');
    }
    return success(input as GeneralRequestDod);
  }

  protected getSuccessResponse(payload: unknown): Response {
    const resultDto: ResultDTO<never, unknown> = {
      httpStatus: 200,
      success: true,
      payload,
    };
    return new Response(JSON.stringify(resultDto), {
      status: resultDto.httpStatus,
      headers: this.getHeaders(),
    });
  }

  protected getFailureResponse(err: ServiceBaseErrors): Response {
    const resultDto: ResultDTO<ServiceBaseErrors, never> = {
      httpStatus: STATUS_CODES[err.name] ?? 400,
      success: false,
      payload: err,
    };
    return new Response(JSON.stringify(resultDto), {
      status: resultDto.httpStatus,
      headers: this.getHeaders(),
    });
  }

  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  protected getErr(errText: string): Result<typeof badRequestError, never> {
    const err = dtoUtility.replaceAttrs(badRequestError, { locale: {
      text: errText,
    } });
    return failure(err);
  }
}
