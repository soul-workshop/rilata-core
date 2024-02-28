import { DTO } from '../../domain/dto';
import { DeliveryEventType } from '../bus/types';
import { TestRepository } from './test-repository';

export type EventAsJson = string;

export type DeliveryEventHandler = (deliveryEvent: DeliveryEventType) => Promise<void>

type GetTestRepoName<R extends TestRepository<string, DTO>> =
  R extends TestRepository<infer N, infer _> ? N : never

type GetTestRepoRecord<R extends TestRepository<string, DTO>> =
  R extends TestRepository<infer _, infer REC> ? REC : never

export type TestBatchRecords<R extends TestRepository<string, DTO>> =
  Record<GetTestRepoName<R>, GetTestRepoRecord<R>[]>
