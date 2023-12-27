import type { EventMessage } from './EventMessage';

export class EventError<eParams = any> extends Error {
	public eventMessage: EventMessage<string, eParams>;

	constructor(msgEvent: EventMessage<any, eParams>) {
		super(typeof msgEvent.returnData.message === 'string' ? msgEvent.returnData.message : 'custom error');
		this.eventMessage = msgEvent;
	}
}
