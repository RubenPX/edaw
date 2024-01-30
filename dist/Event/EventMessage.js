import { v4 } from 'uuid';
export class EventMessage {
    context;
    method;
    params;
    id = v4();
    returnData = undefined;
    error = false;
    resolved = false;
    constructor(context, method, params) {
        this.context = context;
        this.method = method;
        this.params = params;
    }
    static regenerate(evMsg) {
        return new EventMessage(evMsg.context, evMsg.method, evMsg.params);
    }
    /** Re-publish new event without return */
    publish(bus) {
        bus.publish(EventMessage.regenerate(this));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static parseMessageEvent(ev) {
        const { id, context, method, params, ...rest } = ev.data;
        if (context && method) {
            const msgEvent = new EventMessage(context, method, params);
            // Parse extra params
            msgEvent.id = id;
            msgEvent.resolved = rest.resolved ?? false;
            msgEvent.returnData = rest.returnData ?? undefined;
            if (rest.error)
                msgEvent.error = rest.error;
            return msgEvent;
        }
        else {
            const msgEvent = new EventMessage('', '');
            msgEvent.error = true;
            msgEvent.returnData = ev.data;
            return msgEvent;
        }
    }
    static parseErrorEvent(ev) {
        const msgEvent = new EventMessage('', '');
        msgEvent.error = true;
        msgEvent.returnData = ev;
        return msgEvent;
    }
}
