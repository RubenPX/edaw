import type { ContextRoute, clientDefs } from '../Routes/ContextRoute';
import { EventMessage } from '../Event/EventMessage';
import { Logger } from '../Console/Logger';
type EventMsgHandler<out, params> = {
    msgEvent: EventMessage<out, params>;
    clbk: (eventMsg: EventMessage<out, params>) => void;
};
export type clientRoutesType<CTX extends EventBus> = {
    [key in keyof CTX["routes"]]: clientDefs<CTX["routes"][key]>;
};
export declare abstract class EventBus {
    manager: Worker;
    protected abstract routes: {
        [key: string]: ContextRoute<any>;
    };
    protected logger: typeof Logger;
    isWorker: boolean;
    protected constructor(manager: Worker);
    private onWorkerMessage;
    private onWorkerError;
    postMessage<rtnOut, eparams>(msg: EventMessage<rtnOut, eparams>, markAsResolved?: boolean): void;
    protected handlers: EventMsgHandler<any, any>[];
    publish<rtnOut, eparams>(evMsg: EventMessage<rtnOut, eparams>): void;
    dispatchEvent<rtnOut, eparams>(evMsg: EventMessage<rtnOut, eparams>): void;
    offMessage(eventMsg: EventMessage<any, any>): void;
    protected onMessage<rtnOut, eparams>(evMsg: EventMessage<rtnOut, eparams>, clbk: (msg: EventMessage<rtnOut, eparams>) => void): EventMessage<rtnOut, eparams>;
    observe<rtnOut, eparams>(route: {
        context: string;
        method: string;
        params?: eparams;
    }, clbk: EventBus['handlers'][number]['clbk']): EventMessage<rtnOut, eparams>;
    postReturn<returnType, paramsType>(context: string, method: string, params?: paramsType): Promise<EventMessage<returnType, paramsType>>;
    protected postInitialize(): Promise<void>;
    getClientRoutes(): clientRoutesType<this>;
}
export {};
