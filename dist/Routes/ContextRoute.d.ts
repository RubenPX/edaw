import type { ClientRouteDefinition } from '../Client/APIBuilder';
import type { EventBus } from './EventBus';
import type { EventMessage } from '../Event/EventMessage';
import type { EventRunner } from './EventRunner';
export type clientDefs<ctx extends ContextRoute<any>> = {
    [key in keyof ctx['EventRoutes']]: ctx['EventRoutes'][key] extends EventRunner<infer returnType, infer paramsType> ? ClientRouteDefinition<returnType, paramsType> : never;
};
export declare abstract class ContextRoute<repos> {
    abstract readonly EventRoutes: {
        [key: string]: EventRunner;
    };
    protected abstract repos?: repos;
    abstract contextName: string;
    runEvent<rOut, eParams>(bus: EventBus, evMsg: EventMessage<rOut, eParams>): Promise<EventMessage<rOut, eParams>>;
    getRoutes(): clientDefs<this>;
}
