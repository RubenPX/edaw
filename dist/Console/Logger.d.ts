export declare class Logger {
    static readonly production = false;
    static readonly verbose: {
        worker: {
            showIn: boolean;
            showOut: boolean;
        };
        browser: {
            showIn: boolean;
            showOut: boolean;
        };
    };
}
