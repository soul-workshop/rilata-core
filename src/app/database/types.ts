export type EventAsJson = string;

export type EventAsJsonHandler = (event: EventAsJson) => Promise<void>
