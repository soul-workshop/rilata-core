import { JwtCreatorImpl } from '../../../src/api-infra/jwt/jwt-creator';
import { JwtVerifierImpl } from '../../../src/api-infra/jwt/jwt-verifier';
import { defaultJwtConfig, getServerConfig } from '../../../src/api/server/configs';
import { ServerResolves } from '../../../src/api/server/s-resolves';
import { getEnvLogMode } from '../../../src/core/index';
import { ConsoleLogger } from '../../../src/core/logger/console-logger';
import { UserJwtPayload } from '../../service-oriented-impl/auth/services/user/user-authentification/s-params';
import { JwtDecoderImpl } from '../../service-oriented-impl/zz-infra/jwt/decoder';

const jwtSecretKey = 'your-256-bit-secret';

export const serverResolves: ServerResolves<UserJwtPayload> = {
  logger: new ConsoleLogger(getEnvLogMode() ?? 'all'),
  runMode: 'test',
  jwtDecoder: new JwtDecoderImpl(),
  jwtVerifier: new JwtVerifierImpl(jwtSecretKey, defaultJwtConfig),
  jwtCreator: new JwtCreatorImpl(jwtSecretKey, defaultJwtConfig),
  serverConfig: getServerConfig(),
};
