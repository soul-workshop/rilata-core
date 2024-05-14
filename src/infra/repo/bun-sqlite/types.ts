import { UuidType } from '../../../common/types';
import { DTO } from '../../../domain/dto';
import { BunSqliteDatabase } from './database';
import { BunSqliteRepository } from './repository';

export type MigrateRow = {
  id: UuidType,
  description: string,
  sql: string,
};

export type MigratinsRecord = MigrateRow & {
  tableName: string,
  migratedAt: number,
}

export type BunSqliteTransactionData = {
  cb: () => void;
  transactionId: UuidType,
  transactioinDescription: string,
  repositoryName: string,
}

export type BunRepoCtor = new (db: BunSqliteDatabase) => BunSqliteRepository<string, DTO>;
