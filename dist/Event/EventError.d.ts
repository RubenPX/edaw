import type { EventMessage } from './EventMessage';
export declare class EventError<eParams = any> extends Error {
    eventMessage: EventMessage<string, eParams>;
    constructor(msgEvent: EventMessage<any, eParams>);
}
