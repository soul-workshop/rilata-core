import { DTO } from '../../domain/dto';
import { TestRepository } from './test.repository';
import { TestBatchRecords } from './types';

export interface TestDatabase {
  addBatch<R extends TestRepository<string, DTO>>(
    batchRecords: TestBatchRecords<R>
  ): Promise<void>

  clear(): Promise<void | void[]>
}
