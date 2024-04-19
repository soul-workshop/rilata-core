/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { storeDispatcher } from '../../src/app/async-store/store-dispatcher';
import { DelivererToBus } from '../../src/app/bus/deliverer-to-bus';
import { DeliveryBusMessage, DeliveryEvent } from '../../src/app/bus/types';
import { EventRepository } from '../../src/app/database/event-repository';
import { TestDatabase } from '../../src/app/database/test-database';
import { TestRepository } from '../../src/app/database/test-repository';
import { TestBatchRecords } from '../../src/app/database/types';
import { GeneralModuleResolver } from '../../src/app/module/types';
import { failure } from '../../src/common/result/failure';
import { success } from '../../src/common/result/success';
import { Result } from '../../src/common/result/types';
import { UuidType } from '../../src/common/types';
import { dtoUtility } from '../../src/common/utils/dto/dto-utility';
import { uuidUtility } from '../../src/common/utils/uuid/uuid-utility';
import { GeneralEventDod } from '../../src/domain/domain-data/domain-types';
import { GeneralARDParams } from '../../src/domain/domain-data/params-types';
import { GetARParamsEvents } from '../../src/domain/domain-data/type-functions';
import { DTO } from '../../src/domain/dto';

export namespace FakeClassImplements {
  export class TestMemoryDatabase implements TestDatabase {
    protected resolver!: GeneralModuleResolver;

    // eslint-disable-next-line no-use-before-define
    protected repositories: TestMemoryRepository<string, DTO, string>[] = [];

    async init(moduleResolver: GeneralModuleResolver): Promise<void> {
      this.resolver = moduleResolver;
    }

    stop(): void {}

    async clear(): Promise<void[]> {
      return Promise.all(this.repositories.map((r) => r.clear()));
    }

    // eslint-disable-next-line no-use-before-define
    addRepository(repo: TestMemoryRepository<string, DTO, string>): void {
      this.repositories.push(repo);
      repo.init(this.resolver);
    }

    async addBatch<R extends TestRepository<string, DTO>>(
      batchRecords: TestBatchRecords<R>,
    ): Promise<void> {
      await Promise.all(Object.entries(batchRecords)
        .filter(([inputTableName, _]) => this.repositories.find(
          (repo) => repo.tableName === inputTableName,
        ))
        .map(([unputTableName, records]) => (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.repositories.find(
            (repo) => repo.tableName === unputTableName,
          )!.addBatch(records as DTO[])
        )));
    }

    async startTransaction(): Promise<string> {
      const transctionId = uuidUtility.getNewUUID();
      this.repositories.forEach((repo) => repo.startTransaction(transctionId));
      return transctionId;
    }

    async commit(transactionId: string): Promise<void> {
      await Promise.all(this.repositories.map((repo) => repo.commit(transactionId)));
    }

    async rollback(transactionId: string): Promise<void> {
      await Promise.all(this.repositories.map((repo) => repo.rollback(transactionId)));
    }
  }

  type TransactionId = string;
  type RecordId = string;

  type GetStringAttrsKeys<T extends DTO> = keyof {
    [K in keyof T]: T[K] extends string ? T[K] : never
  }

  export class TestMemoryRepository<
    T_NAME extends string,
    REC extends DTO,
    ID_ATTR_NAME extends GetStringAttrsKeys<REC>,
  >
  implements TestRepository<T_NAME, REC> {
    protected records: Record<RecordId, REC> = {};

    protected transactionCache: Record<TransactionId, Record<RecordId, REC>> = {};

    protected removeTransactionCache: Record<TransactionId, RecordId[]> = {};

    protected resolver!: GeneralModuleResolver;

    constructor(
      public tableName: T_NAME,
      protected idAttrName: ID_ATTR_NAME,
      protected db: TestMemoryDatabase,
    ) {
      db.addRepository(this as TestMemoryRepository<string, DTO, string>);
    }

    async clear(): Promise<void> {
      this.records = {};
      this.transactionCache = {};
      this.removeTransactionCache = {};
    }

    async addBatch(records: REC[]): Promise<void> {
      await Promise.all(records.map(async (r) => { await this.add(r); }));
    }

    init(resolver: GeneralModuleResolver): void {
      this.resolver = resolver;
    }

    async startTransaction(transactionId: TransactionId): Promise<void> {
      this.transactionCache[transactionId] = {};
      this.removeTransactionCache[transactionId] = [];
    }

    async commit(transactionId: TransactionId): Promise<void> {
      Object.entries(this.transactionCache[transactionId]).forEach(([key, value]) => {
        this.records[key] = value;
      });
      this.removeTransactionCache[transactionId].forEach((key) => {
        delete this.records[key];
      });
      this.deleteTransaction(transactionId);
    }

    async rollback(transactionId: TransactionId): Promise<void> {
      this.deleteTransaction(transactionId);
    }

    async add(record: REC): Promise<Result<'RecordIsExsistError', undefined>> {
      const transactionId = this.getTransactionId();
      return transactionId === undefined
        ? this.directAddRecord(record)
        : this.addRecordByTransaction(transactionId, record);
    }

    async update(record: REC): Promise<Result<'RecordDoesNotExistError', undefined>> {
      const transactionId = this.getTransactionId();
      return transactionId === undefined
        ? this.directUpdateRecords(record)
        : this.updateRecordByTransaction(transactionId, record);
    }

    async remove(recordId: RecordId): Promise<Result<'RecordDoesNotExistError', undefined>> {
      const transactionId = this.getTransactionId();
      return transactionId === undefined
        ? this.directRemoveRecord(recordId)
        : this.removeRecordByTransaction(transactionId, recordId);
    }

    async find(id: RecordId): Promise<REC | undefined> {
      return dtoUtility.deepCopy(this.records[id]);
    }

    async all(): Promise<REC[]> {
      return dtoUtility.deepCopy(Object.values(this.records));
    }

    async findByAttrs(attrs: Partial<REC>): Promise<REC | undefined> {
      const finded = Object.values(this.records).find((record) => (
        Object.entries(attrs).every(([attrKey, attrValue]) => (
          (record as any)[attrKey] === attrValue),
        )
      ));
      return finded ? dtoUtility.deepCopy(finded) : finded;
    }

    async filterByAttrs(attrs: Partial<REC>): Promise<REC[]> {
      const filtered = Object.values(this.records).filter((record) => (
        Object.entries(attrs).every(([attrKey, attrValue]) => (
          (record as any)[attrKey] === attrValue),
        )
      ));
      return dtoUtility.deepCopy(filtered);
    }

    protected addRecordByTransaction(
      transactionId: TransactionId, record: REC,
    ): Result<'RecordIsExsistError', undefined> {
      const currentTransaction = this.transactionCache[transactionId];
      if (currentTransaction === undefined) throw Error(`not find transation record by id${transactionId}`);
      const existRecord = this.getId(record) in this.records
        || this.getId(record) in currentTransaction;
      if (existRecord) return failure('RecordIsExsistError');
      currentTransaction[this.getId(record)] = dtoUtility.deepCopy(record);
      return success(undefined);
    }

    protected directAddRecord(record: REC): Result<'RecordIsExsistError', undefined> {
      const existRecord = this.getId(record) in this.records;
      if (existRecord) return failure('RecordIsExsistError');
      this.records[this.getId(record)] = dtoUtility.deepCopy(record);
      return success(undefined);
    }

    protected updateRecordByTransaction(
      transactionId: TransactionId, record: REC,
    ): Result<'RecordDoesNotExistError', undefined> {
      if ((this.getId(record) in this.records) === false) return failure('RecordDoesNotExistError');
      const currentTransaction = this.transactionCache[transactionId];
      if (currentTransaction === undefined) throw Error(`not find transation record by id${transactionId}`);
      currentTransaction[this.getId(record)] = dtoUtility.deepCopy(record);
      return success(undefined);
    }

    protected directUpdateRecords(record: REC): Result<'RecordDoesNotExistError', undefined> {
      if ((this.getId(record) in this.records) === false) return failure('RecordDoesNotExistError');
      this.records[this.getId(record)] = dtoUtility.deepCopy(record);
      return success(undefined);
    }

    protected getId(record: REC): string {
      return record[this.idAttrName];
    }

    protected removeRecordByTransaction(
      transactionId: TransactionId, recordId: RecordId,
    ): Result<'RecordDoesNotExistError', undefined> {
      if ((recordId in this.records) === false) return failure('RecordDoesNotExistError');
      const currentTransaction = this.removeTransactionCache[transactionId];
      if (currentTransaction === undefined) throw Error(`not find transation record by id${transactionId}`);
      currentTransaction.push(recordId);
      return success(undefined);
    }

    protected directRemoveRecord(recordId: RecordId): Result<'RecordDoesNotExistError', undefined> {
      if ((recordId in this.records) === false) return failure('RecordDoesNotExistError');
      delete this.records[recordId];
      return success(undefined);
    }

    protected getTransactionId(): TransactionId | undefined {
      const store = storeDispatcher.getThreadStore()?.getStore();
      return store?.unitOfWorkId;
    }

    protected deleteTransaction(transactionId: TransactionId): void {
      delete this.transactionCache[transactionId];
      delete this.removeTransactionCache[transactionId];
    }
  }

  type EventRecord = {
      busMesssageId: UuidType,
      requestId: UuidType,
      busMessageName: string,
      payload: GeneralEventDod,
      published: boolean,
      aRootName: string,
      aRootId: UuidType,
    }

  export class TestEventRepository implements EventRepository {
    protected delivererToBus: DelivererToBus | undefined;

    testRepo: TestMemoryRepository<'domain_event', EventRecord, 'busMesssageId'>;

    constructor(testDb: TestMemoryDatabase) {
      this.testRepo = new TestMemoryRepository('domain_event', 'busMesssageId', testDb);
    }

    init(resovler: GeneralModuleResolver): void {}

    async getAggregateEvents<A extends GeneralARDParams>(
      aRootId: UuidType,
    ): Promise<GetARParamsEvents<A>[]> {
      return (await this.testRepo.all())
        .filter((record) => record.aRootId === aRootId)
        .map((record) => record.payload) as GetARParamsEvents<A>;
    }

    async get(busMessageId: string): Promise<GeneralEventDod | undefined> {
      const record = await this.testRepo.find(busMessageId);
      return record ? record.payload : undefined;
    }

    async addEvents(events: GeneralEventDod[]): Promise<void> {
      events.forEach((event) => {
        this.testRepo.add({
          busMesssageId: event.meta.eventId,
          requestId: event.meta.requestId,
          busMessageName: event.meta.name,
          payload: event,
          aRootId: event.aRoot.attrs[event.aRoot.meta.idName],
          published: false,
          aRootName: event.aRoot.meta.name,
        });

        if (this.delivererToBus) {
          const deliverEvent: DeliveryEvent = {
            type: 'event',
            id: event.meta.eventId,
            name: event.meta.name,
            requestId: event.meta.requestId,
            payload: JSON.stringify(event),
            aRootName: event.aRoot.meta.name,
          };
          this.delivererToBus.handle(deliverEvent);
        }
      });
    }

    async isExist(requestId: string): Promise<boolean> {
      return Boolean(await this.testRepo.find(requestId));
    }

    async getNotPublished(): Promise<DeliveryBusMessage[]> {
      return (await this.testRepo.all())
        .filter((rec) => rec.published === false)
        .map((rec) => ({
          type: 'event',
          busMessageId: rec.busMesssageId,
          busMessageName: rec.busMessageName,
          payload: JSON.stringify(rec.payload),
          requestId: rec.busMesssageId,
          aRootName: rec.aRootName,
        }));
    }

    async markAsPublished(busMessageId: string): Promise<void> {
      const record = await this.testRepo.find(busMessageId);
      if (!record) throw Error(`not found event by id${busMessageId}`);
      record.published = true;
    }

    subscribe(delivererToBus: DelivererToBus): void {
      this.delivererToBus = delivererToBus;
    }
  }
}
