import { JwtDecodeErrors } from '../../../../../../src/app/jwt/jwt-errors';
import { QueryServiceParams } from '../../../../../../src/app/service/types';
import { UuidType } from '../../../../../../src/common/types';
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
