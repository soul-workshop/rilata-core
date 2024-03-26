import { BusServerResolver } from '../../../src/app/server/bus-server-resolver';
import { ServerResolver } from '../../../src/app/server/server-resolver';
import { BusServerResolves } from '../../../src/app/server/server-resolves';
import { ServerStarter } from '../../../src/app/server/server-starter';
import { ModuleConstructors } from '../../../src/app/server/types';
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
import { BusRunServer } from './server';

type AllServerModules = CompanyCmdModule | CompanyReadModule;

class BusServerStarter extends ServerStarter<UserJwtPayload, AllServerModules> {
  constructor(
    ServerCtor: Constructor<BusRunServer>,
    ModuleCtors: ModuleConstructors<AllServerModules>[],
    resolves?: Partial<BusServerResolves<UserJwtPayload>>,
  ) {
    const defaultResolves: BusServerResolves<UserJwtPayload> = {
      logger: new ConsoleLogger(getLoggerMode()),
      runMode: 'test',
      jwtSecretKey: 'your-256-bit-secret',
      jwtConfig: {}, // default jwtConfig
      jwtDecoder: new JwtDecoderImpl(),
      jwtVerifier: new JwtVerifierImpl(),
      jwtCreator: new JwtCreatorImpl(),
      serverConfig: { loggerModes: 'off' }, // default serverConfig,
      bus: new OneServerBus(),
    };
    super(ServerCtor, { ...defaultResolves, ...resolves }, ModuleCtors);
  }

  getResolver(): ServerResolver<UserJwtPayload> {
    return new BusServerResolver(this.resolves as BusServerResolves<UserJwtPayload>);
  }
}

export const serverStarter = new BusServerStarter(
  BusRunServer,
  [
    [CompanyCmdModule, CompanyCmdModuleResolver, getCompanyCmdResolves()],
    [CompanyReadModule, CompanyReadModuleResolver, getCompanyReadResolves()],
  ],
);
