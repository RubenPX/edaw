import type { ClientWorkerManager } from './ClientWorkerManager';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export type ClientRouteDefinition<_returnType, paramsType> = { context: string, method: string, params?: paramsType }

export class APIBuilder<returnType, paramsType> {
	private filters: { [key: string]: (objeto: any) => boolean } = {};
	private sorter: ((a: any, b: any) => -1 | 0 | 1) | null = null;

	constructor(
        public readonly route: ClientRouteDefinition<returnType, paramsType>,
        public readonly client: ClientWorkerManager
	) {}

	setFilter(filterName: string, filterFunction: (objeto: any) => boolean) {
		this.filters[filterName] = filterFunction;
	}

	removeFilter(filterName: string) {
		this.filters = Object.fromEntries(Object.entries(this.filters).filter(itm => itm[0] !== filterName));
	}

	sort(sortFunction: (a: any, b: any) => -1 | 0 | 1) {
		this.sorter = sortFunction;
	}

	getFilters(): { [key: string]: (objeto: any) => boolean } {
		return this.filters;
	}

	getSort(): ((a: any, b: any) => -1 | 0 | 1) | null {
		return this.sorter;
	}
}
