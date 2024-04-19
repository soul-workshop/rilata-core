import { DTO } from '../../domain/dto';
import { Database } from './database';
import { TestRepository } from './test-repository';
import { TestBatchRecords } from './types';

export interface TestDatabase extends Database {
  addBatch<R extends TestRepository<string, DTO>>(
    batchRecords: TestBatchRecords<R>
  ): Promise<void>

  clear(): Promise<void | void[]>
}
