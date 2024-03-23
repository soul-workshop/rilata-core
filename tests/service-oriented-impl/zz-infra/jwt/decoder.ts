import { uuidUtility } from '../../../../src/common/utils/uuid/uuid-utility';
import { BaseJwtDecoder } from '../../../../src/infra/jwt/base-jwt-decoder';
import { UserJwtPayload } from '../../auth/services/user/user-authentification/s-params';

export class JwtDecoderImpl extends BaseJwtDecoder<UserJwtPayload> {
  expiredTimeShiftAsMs: number;

  constructor() {
    super();
    this.expiredTimeShiftAsMs = 0;
  }

  verifyPayloadBody(payload: UserJwtPayload): boolean {
    return uuidUtility.isValidValue(payload.userId);
  }
}
