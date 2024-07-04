import { WebModule } from '#api/module/web.module.js';
import { badRequestError } from '#api/service/constants.js';
import { ServiceBaseErrors } from '#api/service/error-types.js';
import { failure } from '#core/result/failure.js';
import { success } from '#core/result/success.js';
import { Result } from '#core/result/types.js';
import { dtoUtility } from '#core/utils/dto/dto-utility.js';
import { responseUtility } from '#core/utils/response/response-utility.js';
import { GeneralEventDod, GeneralRequestDod } from '#domain/domain-data/domain-types.js';
import { STATUS_CODES } from './constants.js';
import { ModuleController } from './m-controller.ts';
import { ResultDTO, RilataRequest } from './types.js';

export class WebModuleController extends ModuleController {
  getUrls(): string[] | RegExp[] {
    return this.resolver.getModuleUrls();
  }

  /** Перевести http на requestDod и serviceResult на Response<ResultDTO> */
  async execute(req: RilataRequest): Promise<Response> {
    const inputDataResult = await this.getInputData(req);
    if (inputDataResult.isFailure()) return this.getFailureResponse(inputDataResult.value);
    const reqJsonBody = inputDataResult.value;

    const module = this.resolver.getModule() as WebModule;
    const serviceResult = await module.executeService(
      reqJsonBody as GeneralRequestDod | GeneralEventDod, req.caller,
    );
    if (serviceResult.isSuccess()) {
      return this.getSuccessResponse(serviceResult.value);
    }
    const err = (serviceResult as Result<ServiceBaseErrors, never>).value;
    return this.getFailureResponse(err);
  }

  // eslint-disable-next-line max-len
  protected async getInputData(req: RilataRequest): Promise<Result<typeof badRequestError, unknown>> {
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

  protected getSuccessResponse(serviceResult: unknown): Response {
    const resultDto: ResultDTO<never, unknown> = {
      httpStatus: 200,
      success: true,
      payload: serviceResult,
    };
    return responseUtility.createJsonResponse(resultDto, 200);
  }

  protected getFailureResponse(err: ServiceBaseErrors): Response {
    const resultDto: ResultDTO<ServiceBaseErrors, never> = {
      httpStatus: STATUS_CODES[err.name] ?? 400,
      success: false,
      payload: err,
    };
    return responseUtility.createJsonResponse(resultDto, resultDto.httpStatus);
  }

  protected getBadRequestErr(errText: string): Result<typeof badRequestError, never> {
    const err = dtoUtility.replaceAttrs(badRequestError, { locale: {
      text: errText,
    } });
    return failure(err);
  }
}
