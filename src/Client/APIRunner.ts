import { APIBuilder, type ClientRouteDefinition } from './APIBuilder';
import type { ClientWorkerManager } from './ClientWorkerManager';
import type { EventMessage } from '../Event/EventMessage';

export class APIRunner<returnType, paramsType> {
	constructor(private builder: APIBuilder<returnType, paramsType>) {}

	observe(callback: (data: EventMessage<returnType, paramsType>) => void) {
		const evMsg = this.builder.client.observe({
			context : this.builder.route.context,
			method  : this.builder.route.method,
			params  : this.builder.route.params
		}, callback);

		return {
			postEvent      : (params?: paramsType) => this.postObserveMessage(evMsg, params),
			removeObserver : () => this.builder.client.offMessage(evMsg)
		};
	}

	private async postObserveMessage<returnType, paramsType>(evMsg: EventMessage<returnType, paramsType>, params: paramsType) {
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
		client: ClientWorkerManager,
		route: ClientRouteDefinition<returnType, paramsType>
	): APIRunner<returnType, paramsType> {
		const builder = new APIBuilder(route, client);
		return new APIRunner(builder);
	}
}
