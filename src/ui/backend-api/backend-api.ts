import { BadRequestError, GeneralInternalError, GeneralNetError, InternalError, NetError } from '../../api/service/error-types.js';
import { FullServiceResult, FullServiceResultDTO, GeneralCommandServiceParams, GeneralQueryServiceParams } from '../../api/service/types.js';
import { failure } from '../../core/result/failure.js';
import { success } from '../../core/result/success.js';
import { Result } from '../../core/result/types.js';
import { dodUtility } from '../../core/utils/dod/dod-utility.js';
import { Locale } from '../../domain/locale.js';

export class BackendApi {
  constructor(protected moduleUrl: string) {}

  /** делает запрос в бэкенд и возвращает результат.
    @param {Object} requestDod - объект типа RequestDod */
  async request<SERVICE_PARAMS extends GeneralQueryServiceParams | GeneralCommandServiceParams>(
    requestDod: SERVICE_PARAMS['input'],
    ...args: unknown[]
  ): Promise<FullServiceResult<SERVICE_PARAMS>> {
    try {
      const backendResult = await fetch(this.moduleUrl, this.getRequestBody(requestDod));
      const resultDto = await backendResult.json();
      return this.resultDtoToResult(resultDto);
    } catch (e) {
      const err = e as Error;
      if (err.message === 'Failed to fetch') {
        return failure(dodUtility.getAppError<GeneralNetError>(
          'Net error',
          'Похоже нет соединение с интернетом',
          {},
        ));
      }

      return failure(dodUtility.getAppError<GeneralInternalError>(
        'Internal error',
        'Ощибка приложения, попробуйте перезагрузить',
        {},
      ));
    }
  }

  getRequestBody(payload: unknown, ...args: unknown[]): Record<string, unknown> {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    };
  }

  protected resultDtoToResult<P extends GeneralQueryServiceParams | GeneralCommandServiceParams>(
    resultDto: FullServiceResultDTO<P>,
  ): FullServiceResult<P> {
    if (resultDto.success === false) {
      return failure(resultDto.payload);
    }
    if (resultDto.success === true) {
      return success(resultDto.payload);
    }
    return this.notResultDto(resultDto);
  }

  protected notResultDto(value: unknown): Result<BadRequestError<Locale<'Bad request'>>, never> {
    // eslint-disable-next-line no-console
    console.error('response value is not resultDto', value);
    return failure(dodUtility.getDomainError('Bad request', 'Ошибка сети', {}));
  }
}
