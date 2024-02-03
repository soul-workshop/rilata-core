import { DeliveryEvent } from '../bus/types';

export type EventAsJson = string;

export type EventAsJsonHandler = (deliveryEvent: DeliveryEvent) => Promise<void>
