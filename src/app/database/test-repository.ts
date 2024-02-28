import { DTO } from '../../domain/dto';

export interface TestRepository<TABLE_NAME extends string, RECORDS extends DTO> {
  tableName: TABLE_NAME,

  addBatch(records: RECORDS[]): Promise<void>

  clear(): Promise<void>
}
