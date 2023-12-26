import { Logger } from '../../common/logger/logger';
import { failure } from '../../common/result/failure';
import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { Locale } from '../../domain/locale';
import { ResultDTO } from '../result-dto';
import { BadRequestError } from '../use-case/error-types';
import { GeneralCommandUcParams, GeneralQueryUcParams, UcResult } from '../use-case/types';

export abstract class BackendApi {
    protected abstract moduleUrl: string;

    constructor(protected logger: Logger) {}

    async request<UC_PARAMS extends GeneralQueryUcParams | GeneralCommandUcParams>(actionDod: UC_PARAMS['inputOptions'], jwtToken: string): Promise<UcResult<UC_PARAMS>> {
      const backendResult = await fetch(this.moduleUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: jwtToken,
        },
        body: JSON.stringify(actionDod),
      });

      const resultDto = await backendResult.json() as ResultDTO<UC_PARAMS['errors'], UC_PARAMS['successOut']>;
      if (resultDto.success === false) {
        return failure(resultDto.payload);
      }
      if (resultDto.success === true) {
        return success(resultDto.payload);
      }
      return this.notResultDto(resultDto);
    }

    notResultDto(value: unknown): Result<BadRequestError<Locale>, never> {
      this.logger.error('json of response not valid', value);
      return failure({
        locale: {
          text: 'Bad request',
          hint: {},
        },
        name: 'Bad request',
        errorType: 'app-error',
        domainType: 'error',
      });
    }
}
