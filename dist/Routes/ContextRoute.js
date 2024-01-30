export class ContextRoute {
    async runEvent(bus, evMsg) {
        const foundMethod = Object.entries(this.EventRoutes).find(([method]) => method === evMsg.method);
        if (!foundMethod)
            throw new Error('Method not found');
        const runner = foundMethod[1];
        evMsg.returnData = await runner.run({ repo: this.repos, evMsg, params: evMsg.params, bus });
        return evMsg;
    }
    getRoutes() {
        return Object.entries(this.EventRoutes).reduce((arr, [method, _ctx]) => {
            // @ts-expect-error method always will be index of arr
            arr[method] = { context: this.contextName, method };
            return arr;
        }, {});
    }
}
