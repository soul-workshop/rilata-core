import { UuidType } from '../../../common/types';

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
