/* eslint-disable @typescript-eslint/no-empty-function */
import { AnonymousUser, DomainUser, ModuleCaller } from '#api/controller/types.js';
import { Bus } from '../../api/bus/bus.js';
import { PublishBusMessage, SubcribeToBusMessage } from '../../api/bus/types.js';
import { Module } from '../../api/module/module.js';
import { GeneralServerResolver } from '../../api/server/types.js';
import { GeneralEventDod } from '../../domain/domain-data/domain-types.js';

type ModuleName = string;

export class OneServerBus implements Bus {
  protected resolver!: GeneralServerResolver;

  protected subscribers: Record<ModuleName, SubcribeToBusMessage[]> = {};

  async init(resolver: GeneralServerResolver): Promise<void> {
    this.resolver = resolver;
  }

  stop(): void {}

  async subscribe(eventSubscribe: SubcribeToBusMessage): Promise<void> {
    this.getModule(eventSubscribe.publishModuleName); // check, module is runned;
    this.getModule(eventSubscribe.handlerModuleName); // check, module is runned;
    if (!(eventSubscribe.publishModuleName in this.subscribers)) {
      this.subscribers[eventSubscribe.publishModuleName] = [];
    }
    this.subscribers[eventSubscribe.publishModuleName].push(eventSubscribe);
  }

  async publish(eventPublish: PublishBusMessage): Promise<void> {
    const events = this.subscribers[eventPublish.publishModuleName];
    if (!events) return;
    const event = events.find((e) => e.busMessageName === eventPublish.name);
    if (!event) return;

    const eventDod = JSON.parse(eventPublish.payload) as GeneralEventDod;
    const caller: ModuleCaller = {
      type: 'ModuleCaller',
      name: eventDod.meta.moduleName,
      user: eventDod.caller as DomainUser | AnonymousUser,
    };
    await this.getModule(event.handlerModuleName).executeService(eventDod, caller);
  }

  protected getModule(moduleName: ModuleName): Module {
    return this.resolver.getServer().getModule(moduleName);
  }
}
