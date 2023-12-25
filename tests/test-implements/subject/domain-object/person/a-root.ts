import { Caller } from '../../../../../src/app/caller';
import { Logger } from '../../../../../src/common/logger/logger';
import { failure } from '../../../../../src/common/result/failure';
import { success } from '../../../../../src/common/result/success';
import { callerUtility } from '../../../../../src/common/utils/caller/caller-utility';
import { dodUtility } from '../../../../../src/common/utils/domain-object/dod-utility';
import { DomainResult } from '../../../../../src/domain/domain-object-data/aggregate-data-types';
import { AggregateRootHelper } from '../../../../../src/domain/domain-object/aggregate-helper';
import { AggregateRoot } from '../../../../../src/domain/domain-object/aggregate-root';
import { AllowedOnlyEmployeerError, AllowedOnlyStaffManagersError } from '../../domain-data/company/role-errors';
import { AddPersonActionParams } from '../../domain-data/person/add-person.params';
import { AddPhoneActionParams, PersonPhonesAddedEvent } from '../../domain-data/person/add-phones.params';
import { PersonAttrs, PersonMeta, PersonParams } from '../../domain-data/person/params';
import { ComapanyAR } from '../company/a-root';

export class PersonAR extends AggregateRoot<PersonParams> {
  protected helper: AggregateRootHelper<PersonParams>;

  constructor(protected attrs: PersonAttrs, protected version: number, logger: Logger) {
    super();
    this.helper = new AggregateRootHelper(attrs, 'PersonAR', version, [], logger);
  }

  protected getMeta(): PersonMeta {
    return {
      name: 'PersonAR',
      domainType: 'domain-object',
      objectType: 'aggregate',
    };
  }

  /** возвращает в формате Иванов И. И. */
  getShortName(): string {
    const patronomic = this.attrs.patronomic && this.attrs.patronomic.length > 0
      ? ` ${this.attrs.patronomic[0].toUpperCase}.`
      : '';
    return `${this.attrs.lastName} ${this.attrs.name[0].toUpperCase}.${patronomic}`;
  }

  addPhone(
    caller: Caller,
    company: ComapanyAR,
    addPhone: AddPhoneActionParams['command'],
  ): DomainResult<AddPhoneActionParams> {
    const preconditionsResult = this.addPhonePreconditions(caller, company);
    if (preconditionsResult.isFailure()) return preconditionsResult;

    addPhone.phones.forEach((phone) => this.attrs.contacts.phones.push(phone));

    const event = dodUtility.getEventByType<PersonPhonesAddedEvent>(
      'PersonPhoneAddedEvent',
      {
        addedPhones: addPhone.phones,
        aRoot: this.attrs,
      },
      caller,
    );
    this.helper.registerDomainEvent(event);
    return success(undefined);
  }

  addPhonePreconditions(caller: Caller, company: ComapanyAR): DomainResult<AddPersonActionParams> {
    const userId = callerUtility.getUserId(caller);
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
