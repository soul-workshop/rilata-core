import { QueryServiceParams } from '../../../../../../src/api/service/types';
import { JwtDecodeErrors } from '../../../../../../src/core/jwt/jwt-errors';
import { UuidType } from '../../../../../../src/core/types';
import { RequestDod } from '../../../../../../src/domain/domain-data/domain-types';
import { UserParams } from '../../../domain-data/user/params';
import { UserDoesNotExistByLoginError } from '../../../domain-object/user/repo-errors';

export type UserAuthentificationRequestAttrs = {
  login: string,
  pass: string,
}

export type UserJwtPayload = {
  userId: UuidType,
}

export type UserAuthentificationRequestDod = RequestDod<'userAuthentificate', UserAuthentificationRequestAttrs>;

export type UserAuthentificationOut = string;

export type UserAuthentificationErrors = UserDoesNotExistByLoginError | JwtDecodeErrors;

export type UserAuthentificationServiceParams = QueryServiceParams<
  'AuthentificatingUserService',
  UserParams,
  UserAuthentificationRequestDod,
  UserAuthentificationOut,
  UserAuthentificationErrors
>
