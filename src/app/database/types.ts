export type EventAsJson = string;

export type EventAsJsonHandler = (eventName: string, event: EventAsJson) => Promise<void>
