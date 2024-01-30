import { ConsoleFormatter, ConsolePrefix } from '../Console/Formatters';
import { APIRunner } from '../Client/APIRunner';
import { EventMessage } from '../Event/EventMessage';
import { Logger } from '../Console/Logger';
import { isWorker } from '../utils/isWorker';
export class EventBus {
    manager;
    logger = Logger;
    isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
    constructor(manager) {
        this.manager = manager;
        manager.addEventListener('message', (ev) => this.onWorkerMessage(ev));
        manager.addEventListener('error', (ev) => this.onWorkerError(ev));
        manager.addEventListener('messageerror', (ev) => this.onWorkerMessage(ev));
    }
    onWorkerMessage(ev) {
        const msg = EventMessage.parseMessageEvent(ev);
        if ((isWorker && this.logger.verbose.worker.showIn) || (!isWorker && this.logger.verbose.browser.showIn)) {
            console.debug(...ConsolePrefix.reciveMsg, {
                id: { id: msg.id },
                context: msg.context,
                method: msg.method,
                returnData: msg.returnData
            });
        }
        this.publish(msg);
    }
    onWorkerError(ev) {
        const msg = EventMessage.parseErrorEvent(ev);
        console.error(ev);
        if (msg.context === '')
            return;
        if (msg.method === '')
            return;
        this.publish(msg);
    }
    postMessage(msg, markAsResolved = false) {
        if (markAsResolved)
            msg.resolved = true;
        if ((isWorker && this.logger.verbose.worker.showOut) || (!isWorker && this.logger.verbose.browser.showOut)) {
            console.debug(...ConsolePrefix.sendMsg, {
                id: { id: msg.id },
                context: msg.context,
                method: msg.method,
                returnData: msg.returnData
            });
        }
        if (msg.context === '') {
            console.trace();
            throw new Error("Context can not be empty string");
        }
        if (msg.method === '') {
            console.trace();
            throw new Error("Method can not be empty string");
        }
        this.manager.postMessage(msg);
    }
    handlers = [];
    publish(evMsg) {
        if (evMsg.resolved)
            return this.dispatchEvent(evMsg);
        const foundContext = Object.values(this.routes).filter(h => h.contextName === evMsg.context);
        if (foundContext.length !== 0) {
            foundContext.forEach(async (ctx) => {
                try {
                    evMsg.returnData = (await ctx.runEvent(this, evMsg)).returnData;
                }
                catch (error) {
                    evMsg.error = true;
                    evMsg.returnData = error;
                    if (error instanceof Error)
                        evMsg.returnData = { message: error.message, stack: error.stack };
                    if (error instanceof Object)
                        evMsg.returnData = { ...error, ...evMsg.returnData };
                }
                this.postMessage(evMsg, true);
            });
        }
        else {
            evMsg.error = true;
            evMsg.returnData = new Error('Route not found');
            console.trace();
            this.postMessage(evMsg, true);
        }
    }
    dispatchEvent(evMsg) {
        const foundHandlers = this.handlers.filter(h => h.msgEvent.context === evMsg.context && h.msgEvent.method === evMsg.method);
        for (const iterator of foundHandlers)
            iterator.clbk(evMsg);
    }
    offMessage(eventMsg) {
        this.handlers = this.handlers.filter(h => h.msgEvent.id !== eventMsg.id);
        if ((isWorker && this.logger.verbose.worker.unObserve) || (!isWorker && this.logger.verbose.browser.unObserve)) {
            console.debug(...ConsolePrefix.ObserverUnRegister, eventMsg.id);
        }
    }
    onMessage(evMsg, clbk) {
        const newMessage = evMsg;
        this.handlers.push({ msgEvent: newMessage, clbk });
        if ((isWorker && this.logger.verbose.worker.observe) || (!isWorker && this.logger.verbose.browser.observe)) {
            console.debug(...ConsolePrefix.ObserverRegister, newMessage.id, { context: evMsg.context, method: evMsg.method });
        }
        return newMessage;
    }
    observe(route, clbk) {
        const newEvent = new EventMessage(route.context, route.method, route.params);
        return this.onMessage(newEvent, clbk);
    }
    // eslint-disable-next-line max-len
    postReturn(context, method, params) {
        const msg = new EventMessage(context, method, params);
        const prom = new Promise((resolve, reject) => {
            this.onMessage(msg, (evMsg) => {
                if (msg.id !== evMsg.id)
                    return;
                if (evMsg.error)
                    reject(evMsg.returnData);
                else
                    resolve(evMsg);
                this.offMessage(msg);
            });
        });
        this.postMessage(msg);
        return prom;
    }
    async postInitialize() {
        // Register all evento to be routed
        console.groupCollapsed(`${isWorker ? 'Worker' : 'Client'} route registers`);
        Object.entries(this.routes).forEach(([_, ctx]) => {
            Object.entries(ctx.EventRoutes).forEach(([methodName, _]) => {
                console.debug(...ConsoleFormatter.info("routeRegister", { context: ctx.contextName, method: methodName }));
            });
        });
        console.groupEnd();
        // Register routes on client
        const initializedEvent = new EventMessage("root", "initialized");
        initializedEvent.returnData = this.getClientRoutes();
        initializedEvent.resolved = true;
        this.postMessage(initializedEvent, true);
    }
    getClientRoutes() {
        return Object.entries(this.routes).reduce((arr, [ctxName, ctx]) => {
            // @ts-expect-error ctxName alwais will be a index of arr
            arr[ctxName] = ctx.getRoutes();
            return arr;
        }, {});
    }
    instanceRunner(route) {
        return APIRunner.instanceBasic(this, route);
    }
}
