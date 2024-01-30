import type { EventBus } from './EventBus';
import type { EventMessage } from '../Event/EventMessage';
type callback<rOut, eParams, repx> = (options: {
    repo: repx;
    params?: eParams;
    bus: EventBus;
    evMsg: EventMessage<rOut, eParams>;
}) => Promise<rOut>;
export declare class EventRunner<rOut = any, eParams = any, repx = any> {
    repo: repx | typeof NaN;
    run: callback<rOut, eParams, repx>;
    constructor(repo: repx | typeof NaN, run: callback<rOut, eParams, repx>);
    runMethod(ev: EventMessage<rOut, eParams>, bus: EventBus): Promise<rOut>;
    static prepareEvent<rOut, Rparams, repo = undefined>(executor: callback<rOut, Rparams, repo>): (repoData?: repo) => EventRunner<rOut, Rparams, repo>;
}
export {};
