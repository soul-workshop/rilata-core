import { UuidType } from '../../common/types';
import { BusPayloadAsJson } from '../database/types';

export type EventBusMessageType = 'event' | 'aggregate';

type SubcribeToMessageBody = {
  busMessageName: string,
  publishModuleName: string,
  handlerModuleName: string,
}

export type SubcribeToMessage = SubcribeToMessageBody & {
  type: 'message',
}

export type SubcribeToEvent = SubcribeToMessageBody & {
  type: 'event',
}

export type SubcribeToAggregate = SubcribeToMessageBody & {
  type: 'aggregate',
}

/** Тип для подписки в шину */
export type SubcribeToBusMessage = SubcribeToMessage | SubcribeToEvent | SubcribeToAggregate;

type MessageBodyType = {
  busMessageId: UuidType,
  busMessageName: string,
  payload: BusPayloadAsJson,
  requestId: UuidType,
}

type EventBodyType = MessageBodyType & {
  aRootName: string,
}

export type DeliveryMessage = MessageBodyType & {
  type: 'message',
}

export type DeliveryEvent = EventBodyType & {
  type: 'event',
}

/** Тип для доставщика в шину */
export type DeliveryBusMessage = DeliveryMessage | DeliveryEvent;

type PublishBodyType = {
  publishModuleName: string,
}
export type PublishMessage = DeliveryMessage & PublishBodyType;

export type PublishEvent = DeliveryEvent & PublishBodyType;

/** Тип для публикации в шину */
export type PublishBusMessage = PublishMessage | PublishEvent;
