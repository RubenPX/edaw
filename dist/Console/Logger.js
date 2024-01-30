class Logger {
    // @todo: make this variable dependient if is production or not
    static production = false;
    static verbose = {
        worker: {
            observe: false,
            unObserve: false,
            showIn: false,
            showOut: false
        },
        browser: {
            observe: false,
            unObserve: false,
            showIn: false,
            showOut: false
        }
    };
}
export { Logger };
