import { RunMode } from '../../../../src/app/types';
import { AssertionException } from '../../../../src/common/exeptions';
import { AuthFacadeOneServerImpl } from '../../auth/one-server-facades/auth';
import { CompanyFacadeOneServerImpl } from '../../company/infra/one-server-facade/company';
import { SubjectFacadeOneServerImpl } from '../../subject/infra/one-server-facades/subject';
import { FrontendProxyResolves } from '../../z-front-proxy/resolves';

let frontProxyResolves: FrontendProxyResolves;

export function getFrontProxyResolves(runMode: RunMode): FrontendProxyResolves {
  /** в read-module нет своих репозиториев, поэтому удалены ссылки на  */
  if (!frontProxyResolves) {
    frontProxyResolves = {
      moduleName: 'FrontProxyModule',
      runMode,
      companyFacade: new CompanyFacadeOneServerImpl(),
      subjectFacade: new SubjectFacadeOneServerImpl(),
      authFacade: new AuthFacadeOneServerImpl(),
      get db(): never {
        throw Error('read module not supported work with database, only facades');
      },
      get eventRepo(): never {
        throw Error('read module not supported work with database, only facades');
      },
    };
  }

  if (runMode === 'test') return frontProxyResolves;
  throw new AssertionException('not implements other run modes');
}
