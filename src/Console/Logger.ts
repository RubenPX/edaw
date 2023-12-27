export class Logger {
	// @todo: make this variable dependient if is production or not
	public static readonly production = false;
	public static readonly verbose = {
		worker: {
			showIn  : false,
			showOut : true
		},
		browser: {
			showIn  : false,
			showOut : true
		}
	};
}
