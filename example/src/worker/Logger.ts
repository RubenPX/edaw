export class PrivateLogger {
	// @todo: make this variable dependient if is production or not
	public static readonly production = false;
	public static readonly verbose = {
		worker: {
			observe   : true,
			unObserve : false,
			showIn    : false,
			showOut   : true
		},
		browser: {
			observe   : true,
			unObserve : false,
			showIn    : false,
			showOut   : true
		}
	};
}