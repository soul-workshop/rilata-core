import { DomainUser } from '../../../../../src/app/caller';
import { ModuleResolver } from '../../../../../src/app/resolves/module-resolver';
import { failure } from '../../../../../src/common/result/failure';
import { success } from '../../../../../src/common/result/success';
import { UserId } from '../../../../../src/common/types';
import { dodUtility } from '../../../../../src/common/utils/domain-object/dod-utility';
import { DomainResult } from '../../../../../src/domain/domain-object-data/params-types';
import { AggregateRootHelper } from '../../../../../src/domain/domain-object/aggregate-helper';
import { AggregateRoot } from '../../../../../src/domain/domain-object/aggregate-root';
import { AllowedOnlyEmployeerError, AllowedOnlyStaffManagersError } from '../../domain-data/company/role-errors';
import { AddPersonActionParams } from '../../domain-data/person/add-person.params';
import { AddPhoneActionParams } from '../../domain-data/person/add-phones.params';
import { PersonAttrs, PersonParams } from '../../domain-data/person/params';
import { ComapanyAR } from '../company/a-root';

export class PersonAR extends AggregateRoot<PersonParams> {
  protected helper: AggregateRootHelper<PersonParams>;

  constructor(protected attrs: PersonAttrs, protected version: number, resolver: ModuleResolver) {
    super();
    this.helper = new AggregateRootHelper(attrs, 'PersonAR', version, ['contacts.techSupportComments'], resolver);
  }

  /** возвращает в формате Иванов И. И. */
  getShortName(): string {
    const patronomic = this.attrs.patronomic && this.attrs.patronomic.length > 0
      ? ` ${this.attrs.patronomic[0].toUpperCase}.`
      : '';
    return `${this.attrs.lastName} ${this.attrs.name[0].toUpperCase}.${patronomic}`;
  }

  addPhone(
    caller: DomainUser,
    company: ComapanyAR,
    addPhone: AddPhoneActionParams['command'],
  ): DomainResult<AddPhoneActionParams> {
    const preconditionsResult = this.addPhonePreconditions(caller.userId, company);
    if (preconditionsResult.isFailure()) return preconditionsResult;

    addPhone.phones.forEach((phone) => this.attrs.contacts.phones.push(phone));

    this.helper.registerDomainEvent('PersonPhoneAddedEvent', addPhone.phones, addPhone.requestId, caller);
    return success(undefined);
  }

  addPhonePreconditions(userId: UserId, company: ComapanyAR): DomainResult<AddPersonActionParams> {
    if (company.isEmployeer(userId) === false) {
      const err = dodUtility.getDomainErrorByType<AllowedOnlyEmployeerError>(
        'Permission denied',
        'Действие доступно только для работников компании',
        {},
      );
      return failure(err);
    }
    if (company.isStaffmanager(userId) === false) {
      const err = dodUtility.getDomainErrorByType<AllowedOnlyStaffManagersError>(
        'Permission denied',
        'Действие доступно только для менеджеров компании',
        {},
      );
      return failure(err);
    }
    return success(undefined);
  }
}
