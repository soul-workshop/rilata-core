import { UserId } from '../../../../../src/common/types';
import { AggregateRoot } from '../../../../../src/domain/domain-object/aggregate-root';
import { CompanyAttrs, CompanyMeta, CompanyParams } from '../../domain-data/company/params';

export class ComapanyAR extends AggregateRoot<CompanyParams> {
  constructor(protected attrs: CompanyAttrs, protected version: number) {
    super();
  }

  isEmployeer(userId: UserId): boolean {
    return this.attrs.employeers.includes(userId);
  }

  isStaffmanager(userId: UserId): boolean {
    return this.attrs.staffManagers.includes(userId);
  }

  isAdmin(userId: UserId): boolean {
    return this.attrs.admins.includes(userId);
  }

  protected getMeta(): CompanyMeta {
    throw new Error('Method not implemented.');
  }

  getShortName(): string {
    throw new Error('Method not implemented.');
  }
}
