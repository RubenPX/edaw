export class Logger {
	// @todo: make this variable dependient if is production or not
	public static readonly production = false;
	public static readonly verbose = {
		worker: {
			observe   : false,
			unObserve : false,
			showIn    : false,
			showOut   : false
		},
		browser: {
			observe   : false,
			unObserve : false,
			showIn    : false,
			showOut   : false
		}
	};
}
