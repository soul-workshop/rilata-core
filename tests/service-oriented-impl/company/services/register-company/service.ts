import { DomainUser } from '../../../../../src/api/controller/types';
import { ValidationError } from '../../../../../src/api/service/error-types';
import { CommandService } from '../../../../../src/api/service/concrete-service/command.service';
import { InputDodValidator, ServiceResult } from '../../../../../src/api/service/types';
import { failure } from '../../../../../src/core/result/failure';
import { success } from '../../../../../src/core/result/success';
import { Result } from '../../../../../src/core/result/types';
import { UuidType } from '../../../../../src/core/types';
import { dodUtility } from '../../../../../src/core/utils/dod/dod-utility';
import { dtoUtility } from '../../../../../src/core/utils/dto/dto-utility';
import { AuthFacade } from '../../../auth/facade';
import { PersonAlreadyExistsError, PersonDoesntExistByIinError } from '../../../subject/domain-object/person/repo-errors';
import { SubjectFacade } from '../../../subject/facade';
import { RegisterCompanyDomainCommand } from '../../domain-data/company/register-company/a-params';
import { CompanyARFactory } from '../../domain-object/company/factory';
import { CompanyRepository } from '../../domain-object/company/repo';
import { CompanyAlreadyExistError } from '../../domain-object/company/repo-errors';
import { CompanyModuleResolver } from '../../resolver';
import {
  CompanyRegisteredServiceParams, RegisterCompanyOut, RegisterCompanyRequestDod,
  RegisterCompanyRequestDodAttrs,
} from './s.params';
import { RegisterCompanyValidator } from './v.map';
import { UowTransactionStrategy } from '../../../../../src/api/service/transaction-strategy/uow.strategy';
import { requestStoreDispatcher } from '../../../../../src/api/request-store/request-store-dispatcher';

export class RegisteringCompanyService extends CommandService<
  CompanyRegisteredServiceParams, CompanyModuleResolver
> {
  moduleName = 'CompanyModule' as const;

  serviceName = 'RegisteringCompanyService' as const;

  inputDodName = 'registerCompany' as const;

  aRootName = 'CompanyAR' as const;

  protected transactionStrategy = new UowTransactionStrategy(true);

  protected supportedCallers = ['DomainUser'] as const;

  declare protected validator: InputDodValidator<RegisterCompanyRequestDod>;

  async runDomain(
    input: RegisterCompanyRequestDod,
  ): Promise<ServiceResult<CompanyRegisteredServiceParams>> {
    const { caller } = requestStoreDispatcher.getPayload();
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

  async processPerson(
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
