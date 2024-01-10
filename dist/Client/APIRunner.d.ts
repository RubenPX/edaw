import { APIBuilder, type ClientRouteDefinition } from './APIBuilder';
import { EventBus } from '../Routes/EventBus';
import type { EventMessage } from '../Event/EventMessage';
export declare class APIRunner<returnType, paramsType> {
    private builder;
    constructor(builder: APIBuilder<returnType, paramsType>);
    observe(callback: (data: EventMessage<returnType, paramsType>) => void): {
        postEvent: (params?: paramsType) => void;
        removeObserver: () => void;
        catch: (clbkErr: (data: EventMessage<Error, paramsType>) => void) => {
            postEvent: (params?: paramsType) => void;
            removeObsever: () => void;
        };
    };
    private postObserveMessage;
    run(params?: paramsType): Promise<returnType>;
    static instanceBasic<returnType, paramsType>(client: EventBus, route: ClientRouteDefinition<returnType, paramsType>): APIRunner<returnType, paramsType>;
}
