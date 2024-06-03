import { BaseJwtDecoder } from '../../../../src/api-infra/jwt/base-jwt-decoder';
import { uuidUtility } from '../../../../src/core/utils/uuid/uuid-utility';
import { UserJwtPayload } from '../../auth/services/user/user-authentification/s-params';

export class JwtDecoderImpl extends BaseJwtDecoder<UserJwtPayload> {
  expiredTimeShiftAsMs: number;

  constructor() {
    super();
    this.expiredTimeShiftAsMs = 0;
  }

  payloadBodyIsValid(payload: UserJwtPayload): boolean {
    return uuidUtility.isValidValue(payload.userId);
  }
}
