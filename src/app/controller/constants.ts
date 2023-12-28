import { BackendBaseErrors } from '../service/error-types';

export const STATUS_CODES: Record<BackendBaseErrors['meta']['name'], number> = {
  'Not found': 404,
  'Permission denied': 403,
  'Internal error': 500,
  'Bad request': 400,
  'Validation error': 400,
  'Net error': 400,
};
