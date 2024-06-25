/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestError } from '../../api/service/error-types.js';
import { FullServiceResult, FullServiceResultDTO, GeneralWebService, GetServiceParams } from '../../api/service/types.js';
import { failure } from '../../core/result/failure.js';
import { success } from '../../core/result/success.js';
import { Result } from '../../core/result/types.js';
import { dodUtility } from '../../core/utils/dod/dod-utility.js';
import { Locale } from '../../domain/locale.js';

export class BackendApi {
  constructor(protected moduleUrl: string) {}

  /** делает запрос в бэкенд и возвращает результат.
    @param {Object} requestDod - объект типа RequestDod */
  async request<SERVICE extends GeneralWebService>(
    requestDod: GetServiceParams<SERVICE>['input'],
    ...args: unknown[]
  ): Promise<FullServiceResult<SERVICE>> {
    const backendResult = await fetch(this.moduleUrl, this.getRequestBody(requestDod));

    const resultDto = await backendResult.json();
    return this.resultDtoToResult(resultDto);
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

  protected resultDtoToResult<S extends GeneralWebService>(
    resultDto: FullServiceResultDTO<S>,
  ): FullServiceResult<S> {
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
