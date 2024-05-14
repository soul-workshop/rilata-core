import { DomainUser, ModuleCaller } from '../../../../../src/app/controller/types';
import { GeneralModuleResolver } from '../../../../../src/app/module/types';
import { ServiceResult } from '../../../../../src/app/service/types';
import { dodUtility } from '../../../../../src/common/utils/dod/dod-utility';
import { SubjectFacade } from '../../facade';
import { SubjectModule } from '../../module';
import { AddPersonRequestDod, AddPersonRequestDodAttrs, AddPersonServiceParams } from '../../services/person/add-person/s-params';
import { GetPersonByIinRequestDod, GetPersonByIinServiceParams } from '../../services/person/get-by-iin/s-params';

/** Реализация фасада для работы в рамках одного сервера */
export class SubjectFacadeOneServerImpl implements SubjectFacade {
  protected moduleResolver!: GeneralModuleResolver;

  init(resolver: GeneralModuleResolver): void {
    this.moduleResolver = resolver;
  }

  async addPerson(
    attrs: AddPersonRequestDodAttrs, caller: DomainUser,
  ): Promise<ServiceResult<AddPersonServiceParams>> {
    const requestDod = dodUtility.getRequestDod<AddPersonRequestDod>('addPerson', attrs);
    const moduleCaller: ModuleCaller = {
      type: 'ModuleCaller',
      name: this.moduleResolver.getModuleName(),
      user: caller,
    };
    return this.moduleResolver
      .getServerResolver()
      .getServer()
      .getModule<SubjectModule>('SubjectModule')
      .executeService(requestDod, moduleCaller);
  }

  getPersonByIin(
    iin: string, caller: DomainUser,
  ): Promise<ServiceResult<GetPersonByIinServiceParams>> {
    const requestDod = dodUtility.getRequestDod<GetPersonByIinRequestDod>('getPersonByIin', { iin });
    const moduleCaller: ModuleCaller = {
      type: 'ModuleCaller',
      name: this.moduleResolver.getModuleName(),
      user: caller,
    };
    return this.moduleResolver
      .getServerResolver()
      .getServer()
      .getModule<SubjectModule>('SubjectModule')
      .executeService(requestDod, moduleCaller);
  }
}
