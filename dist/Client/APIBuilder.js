import { EventBus } from '../Routes/EventBus';
export class APIBuilder {
    route;
    client;
    filters = {};
    sorter = null;
    constructor(route, client) {
        this.route = route;
        this.client = client;
    }
    setFilter(filterName, filterFunction) {
        this.filters[filterName] = filterFunction;
    }
    removeFilter(filterName) {
        this.filters = Object.fromEntries(Object.entries(this.filters).filter(itm => itm[0] !== filterName));
    }
    sort(sortFunction) {
        this.sorter = sortFunction;
    }
    getFilters() {
        return this.filters;
    }
    getSort() {
        return this.sorter;
    }
}
