import { OneServerBus } from '../../../src/api-infra/bus/one-server-bus';
import { JwtCreatorImpl } from '../../../src/api-infra/jwt/jwt-creator';
import { JwtVerifierImpl } from '../../../src/api-infra/jwt/jwt-verifier';
import { defaultJwtConfig, getServerConfig } from '../../../src/api/server/configs';
import { BusServerResolves } from '../../../src/api/server/s-resolves';
import { ServerStarter } from '../../../src/api/server/server-starter';
import { ModuleConstructors } from '../../../src/api/server/types';
import { getEnvLogMode } from '../../../src/core/index';
import { ConsoleLogger } from '../../../src/core/logger/console-logger';
import { Constructor } from '../../../src/core/types';
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

class BusRunServerStarter extends ServerStarter<AllServerModules> {
  constructor(
    ServerCtor: Constructor<BusRunServer>,
    ServerResolverCtor: Constructor<BusRunServerResolver>,
    ModuleCtors: ModuleConstructors<AllServerModules>[],
    resolves?: Partial<BusServerResolves<UserJwtPayload>>,
  ) {
    const defaultResolves: BusServerResolves<UserJwtPayload> = {
      logger: new ConsoleLogger(getEnvLogMode() ?? 'all'),
      runMode: 'test',
      jwtDecoder: new JwtDecoderImpl(),
      jwtVerifier: new JwtVerifierImpl(jwtSecret, defaultJwtConfig),
      jwtCreator: new JwtCreatorImpl(jwtSecret, defaultJwtConfig),
      serverConfig: getServerConfig(),
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
