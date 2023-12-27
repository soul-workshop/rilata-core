import { Logger } from '../../common/logger/logger';
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { Locale } from '../../domain/locale';
import { ResultDTO } from '../result-dto';
import { BadRequestError } from '../service/error-types';
import { GeneralCommandServiceParams, GeneralQueryServiceParams, ServiceResult } from '../service/types';

export abstract class BackendApi {
    protected abstract moduleUrl: string;

    constructor(protected logger: Logger, protected jwtToken: string) {}

    async request<SERVICE_PARAMS extends GeneralQueryServiceParams | GeneralCommandServiceParams>(
      actionDod: SERVICE_PARAMS['actionDod'],
    ): Promise<ServiceResult<SERVICE_PARAMS>> {
      const backendResult = await fetch(this.moduleUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: this.jwtToken,
        },
        body: JSON.stringify(actionDod),
      });

      const resultDto = await backendResult.json() as ResultDTO<SERVICE_PARAMS['errors'], SERVICE_PARAMS['successOut']>;
      if (resultDto.success === false) {
        return failure(resultDto.payload);
      }
      if (resultDto.success === true) {
        return success(resultDto.payload);
      }
      return this.notResultDto(resultDto);
    }

    private notResultDto(value: unknown): Result<BadRequestError<Locale>, never> {
      this.logger.error('json of response not valid', value);
      return failure({
        locale: {
          text: 'Ошибка интернета',
          hint: {},
        },
        meta: {
          name: 'Bad request',
          errorType: 'app-error',
          domainType: 'error',
        },
      });
    }
}
