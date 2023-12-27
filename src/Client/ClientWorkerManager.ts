import { ConsoleFormatter } from '../Console/Formatters';
import type { ContextRoute } from '../Routes/ContextRoute';
import { EventBus } from '../Routes/EventBus';

import { APIBuilder, type ClientRouteDefinition } from './APIBuilder';
import type { clientRoutesType } from '../WorkerManager';

import { CounterFeature } from '../../Counter/CounterFeature';

export class ClientWorkerManager extends EventBus {
	protected routes: { [key: string]: ContextRoute<any>; };

	public Routes!: clientRoutesType;

	public initialized = false;

	constructor(worker: Worker, initializedEvent?: (routes: clientRoutesType) => void) {
		super(worker);

		console.groupCollapsed('Worker init');

		console.groupCollapsed('Client Initialize routes');
		this.routes = {
			counter: new CounterFeature()
		};

		for (const ctx of Object.values(this.routes)) {
			for (const [mtd] of Object.entries(ctx.EventRoutes)) {
				console.debug(...ConsoleFormatter.info('routeRegister', { context: ctx.contextName, method: mtd }));
			}
		}
		console.groupEnd();

		this.observe({ context: 'root', method: 'initialized' }, (evMsg) => {
			if (evMsg.returnData) this.Routes = evMsg.returnData;
			console.groupEnd();
			this.initialized = true;
			initializedEvent && initializedEvent(evMsg.returnData!);
		});
	}

	public instanceBuilder<returnType, paramsType>(route: ClientRouteDefinition<returnType, paramsType>) {
		return new APIBuilder(route, this);
	}

	private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
	public async waitInitialize() {
		while (!this.initialized) {
			console.log('Initializing...');
			await this.delay(100);
		}
	}

	// eslint-disable-next-line no-use-before-define
	public static instance?: ClientWorkerManager;
	public static getInstance(worker: Worker) {
		if (this.instance == null) this.instance = new ClientWorkerManager(worker);
		return this.instance;
	}
}
