import { defaultJwtConfig, getServerConfig } from '../../../src/app/server/configs';
import { ServerResolves } from '../../../src/app/server/s-resolves';
import { getEnvLogMode } from '../../../src/common/index';
import { ConsoleLogger } from '../../../src/common/logger/console-logger';
import { JwtCreatorImpl } from '../../../src/infra/jwt/jwt-creator';
import { JwtVerifierImpl } from '../../../src/infra/jwt/jwt-verifier';
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
