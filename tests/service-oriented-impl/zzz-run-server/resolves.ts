import { ServerResolves } from '../../../src/app/server/s-resolves';
import { JwtConfig } from '../../../src/app/server/types';
import { ConsoleLogger } from '../../../src/common/logger/console-logger';
import { getLoggerMode } from '../../../src/common/logger/logger-modes';
import { JwtCreatorImpl } from '../../../src/infra/jwt/jwt-creator';
import { JwtVerifierImpl } from '../../../src/infra/jwt/jwt-verifier';
import { UserJwtPayload } from '../../service-oriented-impl/auth/services/user/user-authentification/s-params';
import { JwtDecoderImpl } from '../../service-oriented-impl/zz-infra/jwt/decoder';

const jwtSecretKey = 'your-256-bit-secret';
const jwtConfig: JwtConfig = {
  algorithm: 'HS256',
  jwtLifetimeAsHour: 24,
  jwtRefreshLifetimeAsHour: 24 * 3,
};

export const serverResolves: ServerResolves<UserJwtPayload> = {
  logger: new ConsoleLogger(getLoggerMode()),
  runMode: 'test',
  jwtDecoder: new JwtDecoderImpl(),
  jwtVerifier: new JwtVerifierImpl(jwtSecretKey, jwtConfig),
  jwtCreator: new JwtCreatorImpl(jwtSecretKey, jwtConfig),
  serverConfig: {}, // default serverConfig,
};
