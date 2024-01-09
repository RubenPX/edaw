export declare class EventMessage<out, eparams> {
    context: string;
    method: string;
    params?: eparams | undefined;
    id: string;
    returnData: out | undefined;
    error: boolean;
    resolved: boolean;
    constructor(context: string, method: string, params?: eparams | undefined);
    static parseMessageEvent<rtnOut, prms>(ev: MessageEvent<any>): EventMessage<rtnOut, prms>;
    static parseErrorEvent(ev: ErrorEvent): EventMessage<unknown, unknown>;
}
