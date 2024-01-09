import { EventBus } from '../Routes/EventBus';
export type ClientRouteDefinition<_returnType, paramsType> = {
    context: string;
    method: string;
    params?: paramsType;
};
export declare class APIBuilder<returnType, paramsType> {
    readonly route: ClientRouteDefinition<returnType, paramsType>;
    readonly client: EventBus;
    private filters;
    private sorter;
    constructor(route: ClientRouteDefinition<returnType, paramsType>, client: EventBus);
    setFilter(filterName: string, filterFunction: (objeto: any) => boolean): void;
    removeFilter(filterName: string): void;
    sort(sortFunction: (a: any, b: any) => -1 | 0 | 1): void;
    getFilters(): {
        [key: string]: (objeto: any) => boolean;
    };
    getSort(): ((a: any, b: any) => -1 | 0 | 1) | null;
}
