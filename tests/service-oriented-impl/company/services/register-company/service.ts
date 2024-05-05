import { storeDispatcher } from '../../../../../src/app/async-store/store-dispatcher';
import { DomainUser } from '../../../../../src/app/caller';
import { UowCommandService } from '../../../../../src/app/service/command-service';
import { ValidationError } from '../../../../../src/app/service/error-types';
import { RequestDodValidator, ServiceResult } from '../../../../../src/app/service/types';
import { failure } from '../../../../../src/common/result/failure';
import { success } from '../../../../../src/common/result/success';
import { Result } from '../../../../../src/common/result/types';
import { UuidType } from '../../../../../src/common/types';
import { dodUtility } from '../../../../../src/common/utils/domain-object/dod-utility';
import { dtoUtility } from '../../../../../src/common/utils/dto/dto-utility';
import { AuthFacade } from '../../../auth/facade';
import { PersonAlreadyExistsError, PersonDoesntExistByIinError } from '../../../subject/domain-object/person/repo-errors';
import { SubjectFacade } from '../../../subject/facade';
import { RegisterCompanyDomainCommand } from '../../domain-data/company/register-company/a-params';
import { CompanyARFactory } from '../../domain-object/company/factory';
import { CompanyRepository } from '../../domain-object/company/repo';
import { CompanyAlreadyExistError } from '../../domain-object/company/repo-errors';
import {
  CompanyRegisteredServiceParams, RegisterCompanyOut, RegisterCompanyRequestDod,
  RegisterCompanyRequestDodAttrs,
} from './s.params';
import { RegisterCompanyValidator } from './v.map';

export class RegisteringCompanyService extends UowCommandService<CompanyRegisteredServiceParams> {
  serviceName = 'registerCompany' as const;

  aRootName = 'CompanyAR' as const;

  protected supportedCallers = ['DomainUser'] as const;

  declare protected validator: RequestDodValidator<CompanyRegisteredServiceParams>;

  protected async runDomain(
    input: RegisterCompanyRequestDod,
  ): Promise<ServiceResult<CompanyRegisteredServiceParams>> {
    const { caller } = storeDispatcher.getStoreOrExepction();
    if (caller.type !== 'DomainUser') {
      throw this.logger.error(`not supported called by call: ${caller.type}`);
    }

    const existCompanyResult = await this.existCompany(input.attrs.company.bin);
    if (existCompanyResult.isFailure()) return failure(existCompanyResult.value);

    const personResult = await this.processPerson(input.attrs, caller);
    if (personResult.isFailure()) return failure(personResult.value);
    const personIin = input.attrs.person.iin;

    const userResult = await this.addUser(personIin, caller);

    return this.addCompany(input.attrs, userResult.userId);
  }

  protected async existCompany(bin: string): Promise<Result<CompanyAlreadyExistError, undefined>> {
    const companyRepo = CompanyRepository.instance(this.moduleResolver);
    const getResult = await companyRepo.getByBin(bin);
    if (getResult.isSuccess()) {
      const err = dodUtility.getDomainError<CompanyAlreadyExistError>(
        'CompanyAlreadyExistError',
        'Компания с БИН {{bin}} уже существует',
        { bin },
      );
      return failure(err);
    }
    return success(undefined);
  }

  protected async processPerson(
    input: RegisterCompanyRequestDodAttrs,
    caller: DomainUser,
  ): Promise<Result<PersonAlreadyExistsError | PersonDoesntExistByIinError, string>> {
    const subjectFacade = SubjectFacade.instance(this.moduleResolver);
    if (input.person.type === 'newPerson') {
      const addPersonResult = await subjectFacade.addPerson(
        dtoUtility.excludeAttrs(input.person, 'type'),
        caller,
      );
      if (addPersonResult.isFailure()) return failure(addPersonResult.value);
      return success(addPersonResult.value.id);
    }

    const getPersonResult = await subjectFacade.getPersonByIin(input.person.iin, caller);
    if (getPersonResult.isFailure()) return failure(getPersonResult.value);
    return success(getPersonResult.value.id);
  }

  protected async addUser(
    personIin: string, caller: DomainUser,
  ): Promise<{ userId: UuidType }> {
    const authFacade = AuthFacade.instance(this.moduleResolver);
    const result = await authFacade.addUser(personIin, caller);
    if (result.isFailure()) {
      const errStr = 'Произошла непредвиденная ошибка при создании экземпляра user.'
        + `В модуле subject уже добавлен объект person с ИИН: ${personIin}`;
      throw this.logger.error(errStr);
    }
    return result.value;
  }

  protected async addCompany(
    input: RegisterCompanyRequestDodAttrs, userId: UuidType,
  ): Promise<Result<CompanyAlreadyExistError, RegisterCompanyOut>> {
    const companyFactory = new CompanyARFactory(this.logger);
    const companyAttrs: RegisterCompanyDomainCommand = {
      ...input.company,
      employees: [userId],
      admins: [userId],
    };
    const companyRepo = CompanyRepository.instance(this.moduleResolver);
    const company = companyFactory.create(companyAttrs);
    return companyRepo.addCompany(company);
  }

  protected checkValidations(input: RegisterCompanyRequestDod): Result<ValidationError, undefined> {
    this.validator = new RegisterCompanyValidator(input.attrs.person.type === 'existPerson');
    return super.checkValidations(input);
  }
}
