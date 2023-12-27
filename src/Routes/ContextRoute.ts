import type { ClientRouteDefinition } from '../Client/APIBuilder';
import type { EventBus } from './EventBus';
import type { EventMessage } from '../Event/EventMessage';
import type { EventRunner } from './EventRunner';

// eslint-disable-next-line no-use-before-define
export type clientDefs<ctx extends ContextRoute<any>> = {
		[key in keyof ctx['EventRoutes']]:
				ctx['EventRoutes'][key] extends EventRunner<infer returnType, infer paramsType>
						? ClientRouteDefinition<returnType, paramsType>
						: never
}

export abstract class ContextRoute<repos> {
		public abstract readonly EventRoutes: { [key: string]: EventRunner }
		protected abstract repos?: repos;
		public abstract contextName: string;

		public async runEvent<rOut, eParams>(bus: EventBus, evMsg: EventMessage<rOut, eParams>): Promise<EventMessage<rOut, eParams>> {
			const foundMethod = Object.entries(this.EventRoutes).find(([method]) => method === evMsg.method);
			if (!foundMethod) throw new Error('Method not found');

			const runner = foundMethod[1];
			evMsg.returnData = await runner.run({ repo: this.repos, evMsg, params: evMsg.params, bus });

			return evMsg;
		}

		public getRoutes(): clientDefs<this> {
			return Object.entries(this.EventRoutes).reduce((arr: clientDefs<this>, [method, _ctx]) => {
				// @ts-expect-error method always will be index of arr
				arr[method] = { context: this.contextName, method };
				return arr;
			}, {} as clientDefs<this>);
		}
}
