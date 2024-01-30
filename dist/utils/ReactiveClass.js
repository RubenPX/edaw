export class ReactiveClass {
    reactIDs = [];
    onUpdate(reactID, callback) {
        const foundIndexClbk = this.reactIDs.findIndex(itm => itm.id == reactID);
        if (foundIndexClbk == -1) { // Replace if exist
            this.reactIDs.push({ id: reactID, callback });
            return;
        }
        this.reactIDs[foundIndexClbk].callback = callback;
    }
    offUpdate(reactID) {
        this.reactIDs = this.reactIDs.filter(itm => itm.id != reactID);
    }
    dispatchUpdate() {
        if (this.reactIDs.length == 0)
            return;
        this.reactIDs.map((itm) => itm.callback());
    }
}
