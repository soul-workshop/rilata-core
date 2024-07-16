import { dtoUtility } from '#core/utils/dto/dto-utility.js';
import { BadRequestError } from '../../api/service/error-types.js';
import { FullServiceResult, GeneralWebService, GetServiceParams } from '../../api/service/types.js';
import { JwtDecoder } from '../../core/jwt/jwt-decoder.js';
import { Logger } from '../../core/logger/logger.js';
import { failure } from '../../core/result/failure.js';
import { Result } from '../../core/result/types.js';
import { dodUtility } from '../../core/utils/dod/dod-utility.js';
import { DTO } from '../../domain/dto.js';
import { Locale } from '../../domain/locale.js';
import { BackendApi } from './backend-api.js';

export class JwtBackendApi extends BackendApi {
  constructor(
    moduleUrl: string,
    protected jwtDecoder: JwtDecoder<DTO>,
    protected logger: Logger,
  ) {
    super(moduleUrl);
  }

  /** делает запрос в бэкенд и возвращает результат.
    @param {Object} requestDod - объект типа RequestDod.
    @param {string} jwtToken - jwt токен авторизации (рефреш).
      Для неавторизованного запроса передать пустую строку. */
  async request<SERVICE extends GeneralWebService>(
    requestDod: GetServiceParams<SERVICE>['input'],
    jwtToken: string,
  ): Promise<FullServiceResult<SERVICE>> {
    if (jwtToken && this.jwtDecoder.dateIsExpired(jwtToken)) {
      return this.jwtDecoder.getError('TokenExpiredError');
    }

    return super.request(requestDod);
  }

  getRequestBody(payload: unknown, jwtToken: string): Record<string, unknown> {
    return dtoUtility.extendAttrs(
      super.getRequestBody(payload),
      {
        headers: { Authorization: jwtToken ? `Bearer ${jwtToken}` : '' },
      },
    );
  }

  protected notResultDto(value: unknown): Result<BadRequestError<Locale<'Bad request'>>, never> {
    this.logger.error('response value is not resultDto', value);
    return failure(dodUtility.getDomainError('Bad request', 'Ошибка сети', {}));
  }
}
