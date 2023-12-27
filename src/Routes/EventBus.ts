import { ConsolePrefix } from '../Console/Formatters';
import type { ContextRoute } from '../Routes/ContextRoute';
import { EventMessage } from '../Event/EventMessage';
import { Logger } from '../Console/Logger';
import { isWorker } from '../utils/isWorker';

type EventMsgHandler<out, params> = {
		msgEvent: EventMessage<out, params>,
		clbk: (eventMsg: EventMessage<out, params>) => void
}

export abstract class EventBus {
		protected abstract routes: { [key: string]: ContextRoute<any> }
		// eslint-disable-next-line no-undef
		public isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;

		constructor(public manager: Worker) {
			manager.addEventListener('message', (ev) => this.onWorkerMessage(ev));
			manager.addEventListener('error', (ev) => this.onWorkerError(ev));
			manager.addEventListener('messageerror', (ev) => this.onWorkerMessage(ev));
		}

		private onWorkerMessage(ev: MessageEvent<any>) {
			const msg = EventMessage.parseMessageEvent(ev);

			if ((isWorker && Logger.verbose.worker.showIn) || (!isWorker && Logger.verbose.browser.showIn)) {
				console.debug(...ConsolePrefix.reciveMsg, {
					id         : { id: msg.id },
					context    : msg.context,
					method     : msg.method,
					returnData : msg.returnData
				});
			}

			this.publish(msg);
		}

		private onWorkerError(ev: ErrorEvent) {
			const msg = EventMessage.parseErrorEvent(ev);

			console.error(...ConsolePrefix.Error, { ev });

			this.publish(msg);
		}

		public postMessage<rtnOut, eparams>(msg: EventMessage<rtnOut, eparams>, markAsResolved: boolean = false) {
			if (markAsResolved) msg.resolved = true;

			if ((isWorker && Logger.verbose.worker.showOut) || (!isWorker && Logger.verbose.browser.showOut)) {
				console.debug(...ConsolePrefix.sendMsg, {
					id         : { id: msg.id },
					context    : msg.context,
					method     : msg.method,
					returnData : msg.returnData
				});
			}

			this.manager.postMessage(msg);
		}

		protected handlers: EventMsgHandler<any, any>[] = [];

		public publish<rtnOut, eparams>(evMsg: EventMessage<rtnOut, eparams>) {
			if (evMsg.resolved) return this.dispatchEvent(evMsg);

			const foundContext = Object.values(this.routes).filter(h => h.contextName === evMsg.context);
			if (foundContext.length !== 0) {
				foundContext.forEach(async ctx => {
					try {
						evMsg.returnData = (await ctx.runEvent(this, evMsg)).returnData as rtnOut;
					} catch (error) {
						evMsg.error = true;
						evMsg.returnData = error as rtnOut;
					}
					this.postMessage(evMsg, true);
				});
			} else {
				evMsg.error = true;
				evMsg.returnData = new Error('Route not found') as rtnOut;
				this.postMessage(evMsg, true);
			}
		}

		public dispatchEvent<rtnOut, eparams>(evMsg: EventMessage<rtnOut, eparams>) {
			const foundHandlers = this.handlers.filter(h => h.msgEvent.context === evMsg.context && h.msgEvent.method === evMsg.method);
			for (const iterator of foundHandlers) iterator.clbk(evMsg);
		}

		public offMessage(eventMsg: EventMessage<any, any>): void {
			this.handlers = this.handlers.filter(h => h.msgEvent.id !== eventMsg.id);
			console.debug(...ConsolePrefix.ObserverUnRegister, eventMsg.id);
		}

		protected onMessage<rtnOut, eparams>(evMsg: EventMessage<rtnOut, eparams>, clbk: (msg: EventMessage<rtnOut, eparams>) => void) {
			const newMessage = evMsg;

			this.handlers.push({ msgEvent: newMessage, clbk });
			console.debug(...ConsolePrefix.ObserverRegister, newMessage.id, { context: evMsg.context, method: evMsg.method });

			return newMessage;
		}

		public observe<rtnOut, eparams>(route: { context: string, method: string, params?: eparams }, clbk: EventBus['handlers'][number]['clbk']) {
			const newEvent = new EventMessage<rtnOut, eparams>(route.context, route.method, route.params);
			return this.onMessage<rtnOut, eparams>(newEvent, clbk);
		}

		// eslint-disable-next-line max-len
		public postReturn<returnType, paramsType>(context: string, method: string, params?: paramsType): Promise<EventMessage<returnType, paramsType>> {
			const msg = new EventMessage<returnType, paramsType>(context, method, params);

			const prom = new Promise<EventMessage<returnType, paramsType>>((resolve, reject) => {
				this.onMessage<returnType, paramsType>(msg, (evMsg) => {
					if (msg.id !== evMsg.id) return;

					if (evMsg.error) reject(evMsg.returnData);
					else resolve(evMsg);

					this.offMessage(msg);
				});
			});

			this.postMessage(msg);

			return prom;
		}
}
