import { DTO } from '../../domain/dto';

export type TokenType = 'access' | 'refresh';

export type PlainJWTPayload<PAYLOAD extends DTO> = {
  tokenType: TokenType,
  payload: PAYLOAD,
};

export type DecodedToken<PAYLOAD extends DTO> = PlainJWTPayload<PAYLOAD> & {
  iat: number,
  exp: number,
};

export type JWTTokens = {
  accessToken: string,
  refreshToken: string,
}
