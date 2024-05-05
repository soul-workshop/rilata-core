import { DelivererToBus } from '../../../../app/bus/deliverer-to-bus';
import { DeliveryEvent, EventBodyType } from '../../../../app/bus/types';
import { BusMessageRepository } from '../../../../app/database/bus-message-repository';
import { EventRepository } from '../../../../app/database/event-repository';
import { dtoUtility } from '../../../../common/utils/dto/dto-utility';
import { GeneralEventDod } from '../../../../domain/domain-data/domain-types';
import { GeneralARDParams } from '../../../../domain/domain-data/params-types';
import { GetARParamsEvents } from '../../../../domain/domain-data/type-functions';
import { BunSqliteRepository } from '../repository';
import { MigrateRow } from '../types';

export class EventRepositorySqlite
  extends BunSqliteRepository<'events', GeneralEventDod> implements EventRepository, BusMessageRepository {
  tableName = 'events' as const;

  migrationWRows: MigrateRow[] = [];

  protected delivererToBus?: DelivererToBus;

  create(): void {
    this.db.sqliteDb.run(
      `CREATE TABLE ${this.tableName} (
        id TEXT(36) PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        payload TEXT NOT NULL,
        requestId TEXT(36) NOT NULL,
        isPublished INTEGER NOT NULL CHECK (isPublished IN (0, 1)),
        aRootName TEXT NOT NULL,
        aRootId TEXT(36) NOT NULL
      );
      CREATE INDEX eventsReqIdIndex ON ${this.tableName} (requestId);
      CREATE INDEX eventsArootIdIndex ON ${this.tableName} (aRootId);
      CREATE INDEX eventsIsPblshIndex ON ${this.tableName} (isPublished) WHERE isPublished=0; `,
    );
  }

  async addEvents(events: GeneralEventDod[]): Promise<void> {
    const sql = `INSERT INTO ${this.tableName} VALUES ($id, $name, $pload, $reqId, 0, $aggName, $aggId)`;
    const addEvent = this.db.sqliteDb.prepare(sql);

    const addEventsTransaction = this.db.sqliteDb.transaction((tEvents: GeneralEventDod[]) => {
      tEvents.forEach((event) => {
        const attrs = {
          $id: event.meta.eventId,
          $name: event.meta.name,
          $pload: JSON.stringify(event),
          $reqId: event.meta.requestId,
          $aggName: event.aRoot.meta.name,
          $aggId: event.aRoot.attrs[event.aRoot.meta.idName],
        };
        addEvent.run(attrs);
      });
    });
    addEventsTransaction(events);
  }

  getAggregateEvents<A extends GeneralARDParams>(aRootId: string): Promise<GetARParamsEvents<A>[]> {
    throw new Error('Method not implemented.');
  }

  async findEvent(id: string): Promise<GeneralEventDod | undefined> {
    const sql = `SELECT payload FROM ${this.tableName} WHERE id='${id}'`;
    const result = this.db.sqliteDb.query(sql).get() as { payload: string } | undefined;
    if (!result) return undefined;
    return JSON.parse(result.payload);
  }

  async isExist(id: string): Promise<boolean> {
    const sql = `SELECT id FROM ${this.tableName} WHERE id='${id}'`;
    return Boolean(this.db.sqliteDb.query(sql).get());
  }

  async getNotPublished(): Promise<DeliveryEvent[]> {
    const sql = `SELECT id, name, payload, requestId, isPublished, aRootName, aRootId FROM ${this.tableName} WHERE isPublished=0`;
    const bodies = this.db.sqliteDb.query(sql).all() as EventBodyType[];
    return bodies.map((b) => dtoUtility.extendAttrs(b, { type: 'event' }));
  }

  async markAsPublished(id: string): Promise<{ count: number }> {
    const sql = `UPDATE ${this.tableName} SET isPublished=1 WHERE id='${id}'`;
    this.db.sqliteDb.run(sql);
    return this.db.sqliteDb.query(`SELECT CHANGES() as count FROM ${this.tableName}`).get() as { count: number };
  }

  subscribe(delivererToBus: DelivererToBus): void {
    this.delivererToBus = delivererToBus;
  }
}
