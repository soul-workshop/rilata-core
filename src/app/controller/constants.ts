import { BackendBaseErrors } from '../service/error-types';

export const STATUS_CODES: Record<BackendBaseErrors['name'], number> = {
  'Not found': 404,
  'Permission denied': 403,
  'Internal error': 500,
  'Bad request': 400,
  'Validation error': 400,
  'Net error': 400,
  IncorrectTokenError: 400,
  NotValidTokenPayloadError: 400,
  TokenExpiredError: 400,
  JwtVerifyError: 400,
  RefreshTokenExpiredError: 400,
};
