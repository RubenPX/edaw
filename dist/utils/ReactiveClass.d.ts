export declare abstract class ReactiveClass {
    reactIDs: {
        id: string;
        callback: () => void;
    }[];
    onUpdate(reactID: string, callback: () => void): void;
    offUpdate(reactID: string): void;
    dispatchUpdate(): void;
}
