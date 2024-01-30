export class EventError extends Error {
    eventMessage;
    constructor(msgEvent) {
        super(typeof msgEvent.returnData.message === 'string' ? msgEvent.returnData.message : 'custom error');
        this.eventMessage = msgEvent;
    }
}
