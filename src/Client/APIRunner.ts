import { APIBuilder, type ClientRouteDefinition } from './APIBuilder';
import { EventBus } from '../Routes/EventBus';
import type { EventMessage } from '../Event/EventMessage';

export class APIRunner<returnType, paramsType> {
	constructor(private builder: APIBuilder<returnType, paramsType>) {}

	observe(callback: (data: EventMessage<returnType, paramsType>) => void) {
		let errClbk: ((data: EventMessage<Error, paramsType>) => void) | undefined = undefined;

		const handleRequest = (evMsg: EventMessage<returnType, paramsType>) => {
			if (evMsg.error && errClbk) errClbk(evMsg as EventMessage<Error, paramsType>);
			else callback(evMsg);
		};

		const evMsg = this.builder.client.observe<returnType, paramsType>({
			context : this.builder.route.context,
			method  : this.builder.route.method,
			params  : this.builder.route.params
		}, handleRequest);

		const rtn = {
			postEvent      : (params?: paramsType) => this.postObserveMessage(evMsg, params as paramsType),
			removeObserver : () => this.builder.client.offMessage(evMsg),
			catch          : (clbkErr: (data: EventMessage<Error, paramsType>) => void) => {
				errClbk = clbkErr;
				return { postEvent: rtn.postEvent, removeObsever: rtn.removeObserver };
			}
		};

		return rtn;
	}

	private postObserveMessage(evMsg: EventMessage<returnType, paramsType>, params: paramsType) {
		evMsg.params = params;
		this.builder.client.postMessage(evMsg);
	}

	async run(params?: paramsType): Promise<returnType> {
		const event = await this.builder.client.postReturn(
			this.builder.route.context,
			this.builder.route.method,
			params
		);
		return event.returnData as returnType;
	}

	public static instanceBasic<returnType, paramsType>(
		client: EventBus,
		route: ClientRouteDefinition<returnType, paramsType>
	): APIRunner<returnType, paramsType> {
		const builder = new APIBuilder(route, client);
		return new APIRunner(builder);
	}
}
