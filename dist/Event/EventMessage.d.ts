import type { EventBus } from '../Routes/EventBus';
export declare class EventMessage<out, eparams> {
    context: string;
    method: string;
    params?: eparams | undefined;
    id: any;
    returnData: out | undefined;
    error: boolean;
    resolved: boolean;
    constructor(context: string, method: string, params?: eparams | undefined);
    static regenerate<rOut, eParams>(evMsg: EventMessage<rOut, eParams>): EventMessage<unknown, eParams>;
    /** Re-publish new event without return */
    publish(bus: EventBus): void;
    static parseMessageEvent<rtnOut, prms>(ev: MessageEvent<any>): EventMessage<rtnOut, prms>;
    static parseErrorEvent(ev: ErrorEvent): EventMessage<unknown, unknown>;
}
