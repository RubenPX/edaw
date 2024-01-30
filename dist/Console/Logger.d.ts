export declare class Logger {
    static readonly production = false;
    static readonly verbose: {
        worker: {
            observe: boolean;
            unObserve: boolean;
            showIn: boolean;
            showOut: boolean;
        };
        browser: {
            observe: boolean;
            unObserve: boolean;
            showIn: boolean;
            showOut: boolean;
        };
    };
}
