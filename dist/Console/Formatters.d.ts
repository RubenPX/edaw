export declare const consoleDecorations: {
    RoundedBorder: (color: string) => string;
};
export declare const ConsoleColors: {
    green: string;
    blue: string;
    red: string;
    orange: string;
    purple: string;
};
export declare const isWorker: boolean;
export declare const workerLetter: string;
export declare const ConsolePrefix: {
    sendMsg: string[];
    reciveMsg: string[];
    Error: string[];
    ObserverRegister: string[];
    ObserverUnRegister: string[];
};
export declare class ConsoleFormatter {
    static info(badgeTitles: string | string[], ...data: any[]): any[];
    static warn(badgeTitles: string | string[], ...data: any[]): any[];
    static yellow(badgeTitles: string | string[], ...data: any[]): any[];
    static succes(badgeTitles: string | string[], ...data: any[]): any[];
}
