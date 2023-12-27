import type { EventBus } from './EventBus';
import type { EventMessage } from '../Event/EventMessage';

type callback<rOut, eParams, repx> = (options: {repo: repx, params?: eParams, bus: EventBus, evMsg: EventMessage<rOut, eParams> }) => Promise<rOut>

export class EventRunner<rOut = any, eParams = any, repx = any> {
	constructor(
    public repo: repx | typeof NaN,
    public run: callback<rOut, eParams, repx>
	) {}

	public async runMethod(ev: EventMessage<rOut, eParams>, bus: EventBus): Promise<rOut> {
		if (typeof this.repo === 'number' && isNaN(this.repo)) throw new Error('Repository is not initialized');
		return await this.run({ repo: this.repo as repx, params: ev.params, bus, evMsg: ev });
	}

	public static prepareEvent<rOut, Rparams, repo = undefined>(executor: callback<rOut, Rparams, repo>) {
		return (repoData?: repo) => new EventRunner<rOut, Rparams, repo>(repoData ?? NaN, executor);
	}
}
