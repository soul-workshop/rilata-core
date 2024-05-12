import { BusServerResolver } from '../../../src/app/server/bus.s-resolver';
import { ServerResolver } from '../../../src/app/server/s-resolver';
import { BusServerResolves, ServerResolves } from '../../../src/app/server/s-resolves';
import { ServerStarter } from '../../../src/app/server/server-starter';
import { GeneralServerResolver, JwtConfig, ModuleConstructors } from '../../../src/app/server/types';
import { ConsoleLogger } from '../../../src/common/logger/console-logger';
import { getLoggerMode } from '../../../src/common/logger/logger-modes';
import { Constructor } from '../../../src/common/types';
import { OneServerBus } from '../../../src/infra/bus/one-server-bus';
import { JwtCreatorImpl } from '../../../src/infra/jwt/jwt-creator';
import { JwtVerifierImpl } from '../../../src/infra/jwt/jwt-verifier';
import { JwtDecoderImpl } from '../../service-oriented-impl/zz-infra/jwt/decoder';
import { CompanyCmdModule } from '../company-cmd/module';
import { CompanyCmdModuleResolver } from '../company-cmd/resolver';
import { CompanyReadModule } from '../company-read/module';
import { CompanyReadModuleResolver } from '../company-read/resolver';
import { UserJwtPayload } from '../types';
import { getCompanyCmdResolves } from './module-resolves/company-cmd-resolves';
import { getCompanyReadResolves } from './module-resolves/company-read-resolves';
import { BusRunServerResolver } from './s-resolver';
import { BusRunServer } from './server';

type AllServerModules = CompanyCmdModule | CompanyReadModule;

const jwtSecret = 'your-256-bit-secret';
const jwtConfig: JwtConfig = {
  algorithm: 'HS256',
  jwtLifetimeAsHour: 24,
  jwtRefreshLifetimeAsHour: 24 * 3,
};

class BusRunServerStarter extends ServerStarter<AllServerModules> {
  constructor(
    ServerCtor: Constructor<BusRunServer>,
    ServerResolverCtor: Constructor<BusRunServerResolver>,
    ModuleCtors: ModuleConstructors<AllServerModules>[],
    resolves?: Partial<BusServerResolves<UserJwtPayload>>,
  ) {
    const defaultResolves: BusServerResolves<UserJwtPayload> = {
      logger: new ConsoleLogger(getLoggerMode()),
      runMode: 'test',
      jwtDecoder: new JwtDecoderImpl(),
      jwtVerifier: new JwtVerifierImpl(jwtSecret, jwtConfig),
      jwtCreator: new JwtCreatorImpl(jwtSecret, jwtConfig),
      serverConfig: { loggerModes: 'off' }, // default serverConfig,
      bus: new OneServerBus(),
    };
    super(ServerCtor, ServerResolverCtor, { ...defaultResolves, ...resolves }, ModuleCtors);
  }
}

export const serverStarter = new BusRunServerStarter(
  BusRunServer,
  BusRunServerResolver,
  [
    [CompanyCmdModule, CompanyCmdModuleResolver, getCompanyCmdResolves()],
    [CompanyReadModule, CompanyReadModuleResolver, getCompanyReadResolves()],
  ],
);
