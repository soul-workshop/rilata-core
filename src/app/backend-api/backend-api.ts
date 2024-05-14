import { Logger } from '../../common/logger/logger';
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { dodUtility } from '../../common/utils/dod/dod-utility';
import { DTO } from '../../domain/dto';
import { Locale } from '../../domain/locale';
import { JwtDecoder } from '../jwt/jwt-decoder';
import { BadRequestError } from '../service/error-types';
import { FullServiceResult, FullServiceResultDTO, GeneralCommandServiceParams, GeneralQueryServiceParams } from '../service/types';

export abstract class BackendApi {
    protected abstract moduleUrl: string;

    constructor(protected jwtDecoder: JwtDecoder<DTO>, protected logger: Logger) {}

    /** делает запрос в бэкенд и возвращает результат.
      @param {Object} requestDod - объект типа RequestDod.
      @param {string} jwtToken - jwt токен авторизации (рефреш).
        Для неавторизованного запроса передать пустую строку. */
    async request<SERVICE_PARAMS extends GeneralQueryServiceParams | GeneralCommandServiceParams>(
      requestDod: SERVICE_PARAMS['input'],
      jwtToken: string,
    ): Promise<FullServiceResult<SERVICE_PARAMS>> {
      if (jwtToken && this.jwtDecoder.dateIsExpired(jwtToken)) {
        return this.jwtDecoder.getError('TokenExpiredError');
      }

      const backendResult = await fetch(this.moduleUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
        },
        body: JSON.stringify(requestDod),
      });

      const resultDto = await backendResult.json();
      return this.resultDtoToResult(resultDto);
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

    private notResultDto(value: unknown): Result<BadRequestError<Locale<'Bad request'>>, never> {
      this.logger.error('response value is not resultDto', value);
      return failure(dodUtility.getDomainError('Bad request', 'Ошибка сети', {}));
    }
}
