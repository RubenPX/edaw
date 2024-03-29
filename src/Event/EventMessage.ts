/* eslint-disable no-unused-vars */
import type { EventBus } from '../Routes/EventBus';
import { v4 } from 'uuid';


export class EventMessage<out, eparams> {
	public id = v4();

	public returnData: out | undefined = undefined;
	public error: boolean = false;
	public resolved: boolean = false;

	constructor(
        public context: string,
        public method: string,
        public params?: eparams
	) {}

	public static regenerate<rOut, eParams>(evMsg: EventMessage<rOut, eParams>) {
		return new EventMessage(evMsg.context, evMsg.method, evMsg.params);
	}

	/** Re-publish new event without return */
	public publish(bus: EventBus) {
		bus.publish(EventMessage.regenerate(this));
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static parseMessageEvent<rtnOut, prms>(ev: MessageEvent<any>): EventMessage<rtnOut, prms> {
		const { id, context, method, params, ...rest } = ev.data;
		if (context && method) {
			const msgEvent = new EventMessage(context, method, params);

			// Parse extra params
			msgEvent.id = id;
			msgEvent.resolved = rest.resolved ?? false;
			msgEvent.returnData = rest.returnData ?? undefined;

			if (rest.error) msgEvent.error = rest.error;
			return msgEvent as EventMessage<rtnOut, prms>;
		} else {
			const msgEvent = new EventMessage('', '');
			msgEvent.error = true;
			msgEvent.returnData = ev.data;
			return msgEvent as EventMessage<rtnOut, prms>;
		}
	}

	public static parseErrorEvent(ev: ErrorEvent) {
		const msgEvent = new EventMessage('', '');
		msgEvent.error = true;
		msgEvent.returnData = ev;
		return msgEvent;
	}
}
