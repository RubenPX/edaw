import { APIBuilder } from './APIBuilder';
import { EventBus } from '../Routes/EventBus';
export class APIRunner {
    builder;
    constructor(builder) {
        this.builder = builder;
    }
    observe(callback) {
        let errClbk = undefined;
        const handleRequest = (evMsg) => {
            if (evMsg.error && errClbk)
                errClbk(evMsg);
            else
                callback(evMsg);
        };
        const evMsg = this.builder.client.observe({
            context: this.builder.route.context,
            method: this.builder.route.method,
            params: this.builder.route.params
        }, handleRequest);
        const rtn = {
            postEvent: (params) => {
                this.postObserveMessage(evMsg, params);
                return rtn;
            },
            removeObserver: () => this.builder.client.offMessage(evMsg),
            catch: (clbkErr) => {
                errClbk = clbkErr;
                const { catch: _, ...others } = rtn;
                return others;
            }
        };
        return rtn;
    }
    postObserveMessage(evMsg, params) {
        evMsg.params = params;
        this.builder.client.postMessage(evMsg);
    }
    async run(params) {
        const event = await this.builder.client.postReturn(this.builder.route.context, this.builder.route.method, params);
        return event.returnData;
    }
    static instanceBasic(client, route) {
        const builder = new APIBuilder(route, client);
        return new APIRunner(builder);
    }
}
