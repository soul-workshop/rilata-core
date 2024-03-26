import { ServerResolves } from '../../../src/app/server/server-resolves';
import { ConsoleLogger } from '../../../src/common/logger/console-logger';
import { getLoggerMode } from '../../../src/common/logger/logger-modes';
import { JwtCreatorImpl } from '../../../src/infra/jwt/jwt-creator';
import { JwtVerifierImpl } from '../../../src/infra/jwt/jwt-verifier';
import { UserJwtPayload } from '../../service-oriented-impl/auth/services/user/user-authentification/s-params';
import { JwtDecoderImpl } from '../../service-oriented-impl/zz-infra/jwt/decoder';

export const serverResolves: ServerResolves<UserJwtPayload> = {
  logger: new ConsoleLogger(getLoggerMode()),
  runMode: 'test',
  jwtSecretKey: 'your-256-bit-secret',
  jwtConfig: {}, // default jwtConfig
  jwtDecoder: new JwtDecoderImpl(),
  jwtVerifier: new JwtVerifierImpl(),
  jwtCreator: new JwtCreatorImpl(),
  serverConfig: {}, // default serverConfig,
};
